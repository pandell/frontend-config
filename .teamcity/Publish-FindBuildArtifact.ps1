#requires -Version 7

Param(
    [parameter(Mandatory = $true)]
    [long]$BuildCounter,

    [parameter(Mandatory = $true)]
    [string]$SelectedPackage,

    [parameter(Mandatory = $true)]
    [string]$SelectedTag
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
Set-TeamCityBuildNumber "$BuildCounter | $SelectedPackage"
$artifact = @(Get-ChildItem build/$SelectedPackage*.tgz)
if ($artifact.Count -lt 1) {
    Write-Error "No build artifact for `"$SelectedPackage`""
}
if ($artifact.Count -gt 1) {
    Write-Error "Too many build artifacts for `"$SelectedPackage`""
}

# extract version from artifact name
$artifactBaseName = $artifact[0].BaseName
$artifactPath = $artifact[0].FullName
$artifactVersion = if ($artifactBaseName -match "^$($SelectedPackage)_(.+)$") {
    $Matches[1]
} else {
    $null
}
if (-not $artifactVersion) {
    Write-Error "Missing version in `"$artifactBaseName`""
}

# persist results for subsequent build step(s)
Write-TeamCityMessage "Build artifact for $SelectedPackage version $artifactVersion was found in `"$artifactPath`""
Set-TeamCityBuildNumber "$BuildCounter | $SelectedPackage@$artifactVersion [$SelectedTag]"
Set-TeamCityParameter "packageBuildArtifactFullPath" $artifactPath
