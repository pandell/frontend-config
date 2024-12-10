@file:Suppress("unused")

package lib

import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildFeatures.*
import jetbrains.buildServer.configs.kotlin.buildSteps.*
import jetbrains.buildServer.configs.kotlin.failureConditions.*
import jetbrains.buildServer.configs.kotlin.vcs.*

fun createVcsRootFor(
    repositoryName: String,
    tokenId: String,
): GitVcsRoot =
    GitVcsRoot {
        id("GitHub$repositoryName")
        name = "GitHub-$repositoryName"
        url = "https://github.com/pandell/$repositoryName"
        branch = "refs/heads/master"
        branchSpec = "+:refs/heads/*"
        agentCleanPolicy = GitVcsRoot.AgentCleanPolicy.ALWAYS
        authMethod =
            token {
                userName = "oauth2"
                this.tokenId = tokenId
            }
    }

fun BuildFeatures.publishCommitStatusToGitHub() {
    commitStatusPublisher {
        publisher =
            github {
                githubUrl = "https://api.github.com"
                authType = vcsRoot()
            }
    }
}

fun FailureConditions.failOnNonZero(metricType: BuildFailureOnMetric.MetricType) {
    failOnMetricChange {
        metric = metricType
        threshold = 0
        units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
        comparison = BuildFailureOnMetric.MetricComparison.MORE
        compareTo = value()
    }
}

fun FailureConditions.failOnInspectionOrTestIssues() {
    failOnNonZero(BuildFailureOnMetric.MetricType.INSPECTION_ERROR_COUNT)
    failOnNonZero(BuildFailureOnMetric.MetricType.INSPECTION_WARN_COUNT)
    failOnNonZero(BuildFailureOnMetric.MetricType.TEST_FAILED_COUNT)
}

fun BuildSteps.reSharperInspectionsFor(
    solution: String,
    sdk: String,
    severity: String = "HINT",
    name: String = "R# Analysis",
    configuration: String = "Release",
    path: String = "%teamcity.tool.jetbrains.resharper-clt.DEFAULT%",
    platform: ReSharperInspections.Platform = ReSharperInspections.Platform.CROSS_PLATFORM,
) {
    reSharperInspections {
        this.name = name
        solutionPath = solution
        cltPath = path
        cltPlatform = platform
        customCmdArgs =
            """
            --no-build
            --dotnetcoresdk=$sdk
            --severity=$severity
            --properties:Configuration=$configuration
            --format=Xml
            """.trimIndent()
    }
}

fun BuildSteps.cleanupAttachedDatabasesWithPli65(
    name: String,
    cleanupScript: String = "tools/Remove-TestDatabases.ps1",
) {
    powerShell {
        this.name = name
        edition = PowerShellStep.Edition.Core
        scriptMode =
            file {
                path = cleanupScript
            }
    }
}
