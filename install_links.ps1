function Get-Gm-Scripts() {
    $dirs = Get-ChildItem -Recurse "$($env:APPDATA)/Mozilla/Firefox/" "gm_scripts"
    $title = "Delete Files"
    $message = "Do you want to delete the remaining files in the folder?"

    $options = 0..($dirs.length-1) | % { 
        New-Object System.Management.Automation.Host.ChoiceDescription "&$($_ + 1)) $($dirs[$_].FullName)", ""
    }
    $cancel = New-Object System.Management.Automation.Host.ChoiceDescription "&Cancel", ""
    
    $options = [System.Management.Automation.Host.ChoiceDescription[]](@($cancel) + @($options))

    $result = $host.ui.PromptForChoice("Choose script folder", "Choose the gm_scripts folder for your firefox profile", $options, 0) 

    return $dirs[$result - 1]
}
$gmScriptsDir = Get-Gm-Scripts
if (-not $gmScriptsDir) { exit }

$gmScripts = $gmScriptsDir.FullName
write-host $gmScripts
$scripts = Get-ChildItem . "*.user.js"

foreach ($script in $scripts) {
    $scriptName = $script.Name.substring(0, $script.name.length-8)
    $existingDir = Get-Item "$gmScripts/$scriptName" -ErrorAction SilentlyContinue
    if ($existingDir) {
        write-host "$scriptName dir exists, skipping"
    } else {
        write-host "Creating dir for $scriptName"
        $null = New-Item -ItemType Directory -Path "$gmScripts/$scriptName"
    }
    $existingFile = Get-Item "$gmScripts/$scriptName/$scriptName.user.js" -ErrorAction SilentlyContinue
    if ($existingDir) {
        write-host "$scriptName file exists, skipping"
    } else {
        write-host "Creating link for $scriptName"
        cmd /c mklink /H "$gmScripts\$scriptName\$scriptName.user.js" $script.FullName
        $null = New-Item -ItemType File -Path "$gmScripts/$scriptName/ThisIsSymlinked.txt"
        # New-Item -ItemType SymbolicLink -Path "$gmScripts/$scriptName/$scriptName.user.js" -Value $script
    }
}