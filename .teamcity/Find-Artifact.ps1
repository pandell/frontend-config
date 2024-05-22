#requires -Version 7

Param(
    [parameter(Mandatory = $true)]
    [long]$BuildCounter,

    [parameter(Mandatory = $true)]
    [string]$SelectedNpmPackage,

    [parameter(Mandatory = $true)]
    [string]$SelectedNpmTag
)

# initialize
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
. $PSScriptRoot/Lib-TeamCity.ps1
trap {
    Write-TeamCityError "Error" $_ -ReportAsBuildProblem
    Write-TeamCityBuildStatus "Failed to find build artifact" -Failure
    exit 1
}

# find the artifact
Set-TeamCityBuildNumber "$BuildCounter | $SelectedNpmPackage"
$artifact = @(Get-ChildItem build/$SelectedNpmPackage*.tgz)
if ($artifact.Count -lt 1) {
    Write-Error "No build artifact for `"$SelectedNpmPackage`""
}
if ($artifact.Count -gt 1) {
    Write-Error "Too many build artifacts for `"$SelectedNpmPackage`""
}

# extract version from artifact name
$artifactBaseName = $artifact[0].BaseName
$artifactPath = $artifact[0].FullName
$artifactVersion = if ($artifactBaseName -match "^$($SelectedNpmPackage)_(.+)$") {
    $Matches[1]
} else {
    $null
}
if (-not $artifactVersion) {
    Write-Error "Missing version in `"$artifactBaseName`""
}

# persist results for subsequent build step(s)
Write-TeamCityMessage "Build artifact for $SelectedNpmPackage version $artifactVersion was found in `"$artifactPath`""
Set-TeamCityBuildNumber "$BuildCounter | $SelectedNpmPackage@$artifactVersion [$SelectedNpmTag]"
Set-TeamCityParameter "packageBuildArtifactFullPath" $artifactPath
