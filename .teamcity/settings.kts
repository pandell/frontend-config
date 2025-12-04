// spell-checker:words ktlint npmjs pwsh

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildSteps.*
import jetbrains.buildServer.configs.kotlin.triggers.*
import lib.*

/*
 * Kotlin DSL documentation for TeamCity project:
 * https://build.pandell.com/app/dsl-documentation/root/project/index.html
 *
 * To debug settings scripts in IntelliJ Idea:
 * https://www.jetbrains.com/help/teamcity/kotlin-dsl.html#Debug+Kotlin+DSL+Scripts
 *
 * To debug settings scripts in CLI (attach debugger to port 8000):
 * mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate
 *
 * Format all Kotlin files using https://github.com/pinterest/ktlint/releases
 * cd [repo-root]
 * ktlint --format
 *
 * Generate configurations locally (test Kotlin DSL) using https://github.com/apache/maven/releases
 * cd [repo-root]
 * mvn --file .teamcity teamcity-configs:generate
 */

version = "2025.11"

// Prefixes of packages included in this monorepo.
enum class NpmPackagePrefix {
    BrowsersList,
    ESLint,
    Jest,
    PostCss,
    Prettier,
    StyleLint,
    TypeScript,
    WebPack,
}

// Calculates full package name from the specified prefix.
fun packageNameFromPrefix(npmPackagePrefix: NpmPackagePrefix) = "${npmPackagePrefix.name.lowercase()}-config"

// Runs "yarn pack" for the workspace with the specified package.
fun BuildSteps.execYarnPack(npmPackagePrefix: NpmPackagePrefix) {
    val npmPackage = packageNameFromPrefix(npmPackagePrefix)

    script {
        name = "Pack $npmPackage"
        scriptContent = "yarn workspace @pandell/$npmPackage pack --out ../../${npmPackage}_%%v.tgz"
    }
}

// -----------------------------------------------------------------------------
// Builds and packs all packages included in this monorepo.
// Note: resulting ".tgz" archives are captured as TeamCity artifacts,
// to be used in "publishNpmPackage" build configuration (below).
val buildNpmPackages =
    BuildType {
        id("Build")
        name = "1. Build"
        artifactRules =
            """
            *.tgz
            .teamcity/*.ps1
            """.trimIndent()

        params {
            param(name = "env.PANDELL_NPM_TOKEN", value = "%pandell.npmToken.access%")
        }

        vcs {
            root(DslContext.settingsRoot)
        }

        triggers {
            vcs { }
        }

        features {
            publishCommitStatusToGitHub()
        }

        failureConditions {
            executionTimeoutMin = 20
        }

        steps {
            script {
                name = "Install tooling (and build)"
                scriptContent = "yarn install --immutable"
            }
            script {
                name = "Print tool versions"
                scriptContent = "yarn run versions"
            }
            script {
                name = "Check format (prettier)"
                scriptContent = "yarn run format"
            }
            script {
                name = "Lint (eslint)"
                scriptContent = "yarn run lint --format teamcity"
            }
            execYarnPack(NpmPackagePrefix.BrowsersList)
            execYarnPack(NpmPackagePrefix.ESLint)
            execYarnPack(NpmPackagePrefix.Jest)
            execYarnPack(NpmPackagePrefix.PostCss)
            execYarnPack(NpmPackagePrefix.Prettier)
            execYarnPack(NpmPackagePrefix.StyleLint)
            execYarnPack(NpmPackagePrefix.TypeScript)
            execYarnPack(NpmPackagePrefix.WebPack)
        }

        requirements {
            contains("teamcity.agent.jvm.os.name", "Linux")
        }
    }

// -----------------------------------------------------------------------------
// Publish selected package using the selected tag.
// Note: package is not rebuilt at this time, we use the ".tgz" file
// that was produced during build and captured in artifacts.
val publishConfig =
    BuildType {
        id("Publish")
        name = "2. Publish"
        type = BuildTypeSettings.Type.DEPLOYMENT
        enablePersonalBuilds = false
        maxRunningBuilds = 1

        params {
            select(
                name = "numberOfBuildToPublish",
                value = """Use "Dependencies" tab""",
                label = "Build to publish",
                display = ParameterDisplay.PROMPT,
                options = listOf("""Use "Dependencies" tab"""),
            )
            select(
                name = "selectedNpmPackage",
                value = "",
                label = "Package to publish",
                display = ParameterDisplay.PROMPT,
                options =
                    listOf(
                        packageNameFromPrefix(NpmPackagePrefix.BrowsersList),
                        packageNameFromPrefix(NpmPackagePrefix.ESLint),
                        packageNameFromPrefix(NpmPackagePrefix.Jest),
                        packageNameFromPrefix(NpmPackagePrefix.PostCss),
                        packageNameFromPrefix(NpmPackagePrefix.Prettier),
                        packageNameFromPrefix(NpmPackagePrefix.StyleLint),
                        packageNameFromPrefix(NpmPackagePrefix.TypeScript),
                        packageNameFromPrefix(NpmPackagePrefix.WebPack),
                    ),
            )
            text(
                name = "selectedNpmTag",
                value = "latest",
                label = """NPM tag for the published package (defaults to "latest")""",
                display = ParameterDisplay.PROMPT,
            )
            text(
                name = "npmPublishToken",
                value = "",
                label = """NPM token that grants permission to publish this package""",
                display = ParameterDisplay.PROMPT,
            )
            param(name = "packageBuildArtifactFullPath", value = "")
        }

        dependencies {
            artifacts(buildNpmPackages) {
                buildRule = build(buildNumber = "%numberOfBuildToPublish%")
                artifactRules =
                    """
                    +:%selectedNpmPackage%*.tgz => %system.teamcity.build.tempDir%/deploy
                    +:*.ps1 => %system.teamcity.build.tempDir%/deploy
                    """.trimIndent()
            }
            artifacts(AbsoluteId("Tools_Deployment_PublishScripts")) {
                buildRule = build(buildNumber = "%pandell.deployment.scripts.build%")
                artifactRules = "** => %system.teamcity.build.tempDir%/deploy/tools"
            }
        }

        steps {
            script {
                name = "Print tool versions"
                scriptContent = "echo '[pwsh]' && pwsh --version && echo -e '\n[npm]' && npm --version"
            }
            powerShell {
                name = "Find package build artifact"
                edition = PowerShellStep.Edition.Core
                // Sets path of the found artifact to parameter %packageBuildArtifactFullPath%.
                scriptMode = file { path = "%system.teamcity.build.tempDir%/deploy/Find-Artifact.ps1" }
                scriptArgs =
                    """
                    -BuildCounter %build.counter%
                    -SelectedNpmPackage "%selectedNpmPackage%"
                    -SelectedNpmTag "%selectedNpmTag%"
                    """.trimIndent()
            }
            script {
                name = "Publish package build artifact"
                scriptContent =
                    """
                    env "npm_config_//registry.npmjs.org/:_authToken=%npmPublishToken%" npm publish --access public --tag '%selectedNpmTag%' '%packageBuildArtifactFullPath%'
                    """
            }
        }

        requirements {
            contains("teamcity.agent.jvm.os.name", "Linux")
        }
    }

// -----------------------------------------------------------------------------
// Top-level frontend configurations project.
project {
    params {
        param(name = "env.PATH", value = "%env.PATH%:%pandell.agent.node.v24.dir%/bin")
    }

    buildType(buildNpmPackages)
    buildType(publishConfig)
}
