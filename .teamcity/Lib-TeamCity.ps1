#Requires -version 5
# Lib-TeamCity.ps1, revision 2023-10-18

<#
.SYNOPSIS
Determines if the current process is running on a TeamCity agent.

.NOTES
We assume a process is running on a TeamCity agent when
the environment variable "TEAMCITY_VERSION" has a non-empty-string value.
#>
function Test-IsRunningOnTeamCity {
    return !!$env:TEAMCITY_VERSION;
}


<#
.SYNOPSIS
Escapes the specified message for use in "##teamcity" blocks.

.NOTES
"ConvertTo" prefix was the best match from PowerShell's list of
approved verbs @ https://docs.microsoft.com/en-us/powershell/scripting/developer/cmdlet/approved-verbs-for-windows-powershell-commands?view=powershell-7.2#data-verbs.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Escaped+values
#>
function ConvertTo-TeamCityMessage(
    [string]
    $Message
) {
    if (-not (Test-IsRunningOnTeamCity)) {
        Write-Warning "Not executing on TeamCity. Did you mean to call `"ConvertTo-TeamCityMessage`"?"
    }

    $Message = $Message -replace "['|\[\]]", "|$&" # "$&" is matched string, see https://docs.microsoft.com/en-ca/powershell/module/microsoft.powershell.core/about/about_comparison_operators#regular-expressions-substitutions
    $Message = $Message -replace "\r", "|r"
    $Message = $Message -replace "\n", "|n"

    # escape non-ASCII characters
    $nonAsciiRegex = [regex]"[\u0080-\uFFFF]"
    $Message = $nonAsciiRegex.Replace(
        $Message,
        { param($match) return "|0x$(([int]$match.Value[0]).ToString("X4"))" })

    return $Message
}


<#
.SYNOPSIS
Writes a message to the console and to TeamCity build log that will change
current build's number to the specified value, overriding the default pattern
setup in build configuration.

.NOTES
Build number can be an arbitrary string, for example "42 | Acme 1.0.4 beta 2".

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Reporting+Build+Number
#>
function Set-TeamCityBuildNumber([string]$BuildNumber) {
    if ($BuildNumber) {
        if (Test-IsRunningOnTeamCity) {
            Write-Host "##teamcity[buildNumber '$(ConvertTo-TeamCityMessage($BuildNumber))']"
        } else {
            Write-Host -ForegroundColor DarkGray -NoNewline "[Set build number] "
            Write-Host -ForegroundColor DarkYellow $BuildNumber
        }
    }
}


<#
.SYNOPSIS
Writes a message to the console that will be used by TeamCity to set a build parameter.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#set-parameter
#>
function Set-TeamCityParameter(
    [Parameter(Mandatory = $true)]
    [string]
    $ParameterName,

    [Parameter(Mandatory = $true)]
    [string]
    $Value
) {
    if (Test-IsRunningOnTeamCity) {
        Write-Host "##teamcity[setParameter name='$(ConvertTo-TeamCityMessage($ParameterName))' value='$(ConvertTo-TeamCityMessage($Value))']"
    } else {
        Write-Host -ForegroundColor DarkGray -NoNewline "[Set parameter] "
        Write-Host -ForegroundColor DarkYellow -NoNewline $ParameterName
        Write-Host -ForegroundColor DarkGray -NoNewline " = "
        Write-Host -ForegroundColor DarkYellow $Value
    }
}


<#
.SYNOPSIS
Wraps the provided script block in block service messages.
Blocks are used to group several messages in TeamCity's build log.

.PARAMETER BlockMessage
The block message. Cannot be null or empty.

.PARAMETER ScriptBlock
The script block to be executed.

.PARAMETER ReportAsProgress
If true, the block message is written as a TeamCity progress message.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Blocks+of+Service+Messages
#>
function Use-TeamCityBlock(
    [Parameter(Mandatory = $true)]
    [string]
    $BlockMessage,

    [Parameter(Mandatory = $true)]
    [scriptblock]
    $ScriptBlock,

    [switch]
    $ReportAsProgress
) {
    if (Test-IsRunningOnTeamCity) {
        $encodedBlockMessage = ConvertTo-TeamCityMessage($BlockMessage)
        Write-Host "##teamcity[blockOpened name='$encodedBlockMessage']"
    } else {
        Write-Host -ForegroundColor DarkGray -NoNewline "[Block opened] "
        Write-Host -ForegroundColor Blue $BlockMessage
    }

    # as of 2022-03-31 TeamCity 2021.2.3 does not show progress
    # message if we write progress message followed by block-open message
    # (as per milanG's experiments); reverse order seems to work
    if ($ReportAsProgress) {
        Write-TeamCityProgress $BlockMessage
    }

    try {
        &$ScriptBlock
    } finally {
        if (Test-IsRunningOnTeamCity) {
            Write-Host "##teamcity[blockClosed name='$encodedBlockMessage']"
        } else {
            Write-Host -ForegroundColor DarkGray -NoNewline "[Block closed] "
            Write-Host -ForegroundColor Blue $BlockMessage
        }
    }
}


<#
.SYNOPSIS
Writes an error message to the console and to TeamCity build log.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Reporting+Build+Problems
#>
function Write-TeamCityError(
    [string]
    $ErrorMessage,

    [System.Management.Automation.ErrorRecord]
    $ErrorRecord,

    [switch]
    $ReportAsBuildProblem
) {
    $message = if ($ErrorRecord -and $ErrorMessage) {
        "$ErrorMessage`: $ErrorRecord"
    } elseif ($ErrorRecord) {
        "$ErrorRecord"
    } else {
        $ErrorMessage
    }
    if ($message) {
        $details = if ($ErrorRecord) {
            "[$($ErrorRecord.FullyQualifiedErrorId)]`n$($ErrorRecord.ScriptStackTrace)"
        }

        if ($ReportAsBuildProblem) {
            Write-TeamCityBuildProblem $message
        }

        if (Test-IsRunningOnTeamCity) {
            if ($details) {
                Write-Host "##teamcity[message status='ERROR' text='$(ConvertTo-TeamCityMessage($message))' errorDetails='$(ConvertTo-TeamCityMessage($details))']"
            } else {
                Write-Host "##teamcity[message status='ERROR' text='$(ConvertTo-TeamCityMessage($message))']"
            }
        } else {
            # skip when reporting as build problem to not duplicate the message
            if (-not $ReportAsBuildProblem) {
                Write-Host -ForegroundColor Red $message
            }
            if ($details) {
                Write-Host -ForegroundColor DarkRed $details
            }
        }
    }
}


<#
.SYNOPSIS
Writes a warning message to the console and to TeamCity build log.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Reporting+Build+Problems
#>
function Write-TeamCityWarning(
    [string]
    $Message
) {
    if ($Message) {
        if (Test-IsRunningOnTeamCity) {
            Write-Host "##teamcity[message status='WARNING' text='$(ConvertTo-TeamCityMessage($message))']"
        } else {
            Write-Host -ForegroundColor DarkYellow $message
        }
    }
}


<#
.SYNOPSIS
Writes a regular service message to the console and to TeamCity build log.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Reporting+Messages+to+Build+Log
#>
function Write-TeamCityMessage(
    [string]
    $Message
) {
    if (Test-IsRunningOnTeamCity) {
        Write-Host "##teamcity[message text='$(ConvertTo-TeamCityMessage($Message))']"
    } else {
        Write-Host -ForegroundColor Blue $Message
    }
}


<#
.SYNOPSIS
Writes a progress message to the console and to TeamCity build log.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Reporting+Build+Progress
#>
function Write-TeamCityProgress(
    [string]
    $Message
) {
    if ($Message) {
        if (Test-IsRunningOnTeamCity) {
            Write-Host "##teamcity[progressMessage '$(ConvertTo-TeamCityMessage($Message))']"
        } else {
            Write-Host -ForegroundColor DarkGray -NoNewline "[Progress] "
            Write-Host -ForegroundColor DarkYellow $Message
        }
    }
}


<#
.SYNOPSIS
Writes a build problem message to the console and to TeamCity build log.

.PARAMETER Description
Description of the build problem.  Cannot be null or empty.

.PARAMETER ProblemIdentity
The build problem identity.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Reporting+Build+Problems
#>
function Write-TeamCityBuildProblem(
    [Parameter(Mandatory = $true)]
    [string]
    $Description,

    [string]
    $ProblemIdentity
) {
    if (Test-IsRunningOnTeamCity) {
        if ($ProblemIdentity) {
            Write-Host "##teamcity[buildProblem description='$(ConvertTo-TeamCityMessage($Description))' identity='$(ConvertTo-TeamCityMessage($ProblemIdentity))']"
        } else {
            Write-Host "##teamcity[buildProblem description='$(ConvertTo-TeamCityMessage($Description))']"
        }
    } else {
        Write-Host -ForegroundColor DarkGray -NoNewline "[Build problem] "
        Write-Host -ForegroundColor Red $Message
    }
}


<#
.SYNOPSIS
Writes a build status message to the console and to TeamCity build log.

.NOTES
This sets the outcome of the whole TeamCity build.
Only use when the TeamCity-calculated status doesn't
fit your needs or is confusing.

.LINK
https://www.jetbrains.com/help/teamcity/service-messages.html#Reporting+Build+Status
#>
function Write-TeamCityBuildStatus(
    [string]
    $StatusText,

    [switch]
    $Success,

    [switch]
    $Failure
) {
    if ($StatusText) {
        if (Test-IsRunningOnTeamCity) {
            if ($Success) {
                Write-Host "##teamcity[buildStatus text='$(ConvertTo-TeamCityMessage($StatusText))' status='SUCCESS']"
            } elseif ($Failure) {
                Write-Host "##teamcity[buildStatus text='$(ConvertTo-TeamCityMessage($StatusText))' status='FAILURE']"
            } else {
                Write-Host "##teamcity[buildStatus text='$(ConvertTo-TeamCityMessage($StatusText))']"
            }
        } else {
            if ($Success) {
                Write-Host -ForegroundColor DarkGray -NoNewline "[Build status: SUCCESS] "
                Write-Host -ForegroundColor DarkGreen $StatusText
            } elseif ($Failure) {
                Write-Host -ForegroundColor DarkGray -NoNewline "[Build status: FAILURE] "
                Write-Host -ForegroundColor Red $StatusText
            } else {
                Write-Host -ForegroundColor DarkGray -NoNewline "[Build status] "
                Write-Host -ForegroundColor Blue $StatusText
            }
        }
    }
}
