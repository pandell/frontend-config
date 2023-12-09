import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.BuildSteps
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.BuildTypeSettings
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
import jetbrains.buildServer.configs.kotlin.RelativeId
import jetbrains.buildServer.configs.kotlin.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.buildSteps.exec
import jetbrains.buildServer.configs.kotlin.buildSteps.powerShell
import jetbrains.buildServer.configs.kotlin.buildSteps.PowerShellStep
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import jetbrains.buildServer.configs.kotlin.ui.*

/*
 * Kotlin DSL documentation for TeamCity project:
 * https://build.pandell.com/app/dsl-documentation/root/project/index.html
 *
 * To debug settings scripts in IntelliJ Idea:
 * https://www.jetbrains.com/help/teamcity/kotlin-dsl.html#Debug+Kotlin+DSL+Scripts
 *
 * To debug settings scripts in CLI (attach debugger to port 8000):
 * mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate
 */

version = "2023.11"

// prefixes of packages included in this monorepo
enum class ConfigPackagePrefix {
  browserslist,
  eslint,
  jest,
  prettier,
  stylelint,
  typescript
}

// calculates full package name from the specified prefix
fun packageNameFromPrefix(packagePrefix: ConfigPackagePrefix) = "$packagePrefix-config"

// runs "yarn pack" for the workspace with the specified package
fun BuildSteps.execYarnPack(packagePrefix: ConfigPackagePrefix) {
  var target = packageNameFromPrefix(packagePrefix)

  exec {
    name = "Pack $target"
    path = "yarn"
    arguments = "workspace @pandell/$target pack --out ../../${target}_%%v.tgz"
  }
}

// =============================================================================

project {
  params {
    param("env.Path", "%env.Path%;%env.NodeRoot20100%")
  }

  // ---------------------------------------------------------------------------
  // build and pack all packages included in this monorepo
  // note: resulting ".tgz" archives are captured as TeamCity artifacts,
  // to be used in publish build configuration
  buildType {
    id("Build")
    name = "1. Build"
    artifactRules = "*.tgz"

    vcs {
      root(DslContext.settingsRoot)
    }

    triggers {
      vcs { }
    }

    features {
      commitStatusPublisher {
        publisher = github {
          githubUrl = "https://api.github.com"
          authType = vcsRoot()
        }
      }
    }

    params {
      param("env.PANDELL_NPM_TOKEN", "%pandell.npmToken.access%")
    }

    steps {
      exec {
        name = "Install tooling"
        path = "yarn"
        arguments = "install --immutable"
      }
      exec {
        name = "Print tool versions"
        path = "yarn"
        arguments = "run versions"
      }
      exec {
        name = "Check format (prettier)"
        path = "yarn"
        arguments = "run format"
      }
      execYarnPack(ConfigPackagePrefix.browserslist)
      execYarnPack(ConfigPackagePrefix.eslint)
      execYarnPack(ConfigPackagePrefix.jest)
      execYarnPack(ConfigPackagePrefix.prettier)
      execYarnPack(ConfigPackagePrefix.stylelint)
      execYarnPack(ConfigPackagePrefix.typescript)
    }
  }

  // ---------------------------------------------------------------------------
  // publish selected package using the selected tag
  // note: package is not rebuilt at this time, we use the ".tgz" file
  // that was produced during build and captured in artifacts
  buildType {
    id("Publish")
    name = "2. Publish"
    type = BuildTypeSettings.Type.DEPLOYMENT
    enablePersonalBuilds = false
    maxRunningBuilds = 1

    vcs {
      root(DslContext.settingsRoot)
    }

    dependencies {
      dependency(RelativeId("Build")) {
        snapshot {
          onDependencyFailure = FailureAction.FAIL_TO_START
        }

        artifacts {
          cleanDestination = true
          artifactRules = "%selectedPackage%*.tgz => build"
        }
      }
    }

    params {
      select(
        "selectedPackage",
        "",
        label = "Package to publish",
        display = ParameterDisplay.PROMPT,
        options = listOf(
          packageNameFromPrefix(ConfigPackagePrefix.browserslist),
          packageNameFromPrefix(ConfigPackagePrefix.eslint),
          packageNameFromPrefix(ConfigPackagePrefix.jest),
          packageNameFromPrefix(ConfigPackagePrefix.prettier),
          packageNameFromPrefix(ConfigPackagePrefix.stylelint),
          packageNameFromPrefix(ConfigPackagePrefix.typescript)
        )
      )
      text(
        "selectedTag",
        "latest",
        label = "NPM tag",
        display = ParameterDisplay.PROMPT
      )
      param("packageBuildArtifactFullPath", "")
      param("env.NPM_CONFIG_//registry.npmjs.org/:_authToken", "%pandell.npmToken.publish%")
    }

    steps {
      exec {
        name = "Print tool versions"
        path = "cmd"
        arguments = """/c echo "[pwsh]" && pwsh --version && echo: && echo "[npm]" && npm --version"""
      }
      powerShell {
        name = "Find package build artifact"
        edition = PowerShellStep.Edition.Core
        scriptMode = file { path = ".teamcity/Publish-FindBuildArtifact.ps1" }
        scriptArgs = """
          -BuildCounter %build.counter%
          -SelectedPackage "%selectedPackage%"
          -SelectedTag "%selectedTag%"
        """.trimIndent()
      }
      exec {
        name = "Publish package build artifact"
        path = "npm"
        arguments = """publish --access public --tag "%selectedTag%" "%packageBuildArtifactFullPath%" """
      }
    }
  }
}
