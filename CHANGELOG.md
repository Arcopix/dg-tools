## Version 0.5.0009

**New features:**

1. Planet statistics now has _"Partial Copy"_ button which only copies the income
1. Planet statistics now has _"Available reinforcements"_ which lists any available warships, invasions and soldiers
1. Planet statistics now has _"Parked transports"_ which lists any available transport ships
1. All friendly _(owned by the player)_ planets are now links to the respective planet page instead of coordinates
1. _Experimental fleet caching - usage reserved for future versions_
1. Planet and Fleet listing pages now have built-in filters _(also accessible via `/` or `Ctrl+F`)_
1. Implemented "Landed ships" inline information for each planet (configurable via Settings)
1. Implemented confirmation on invasion _(optional, configurable in the settings, disabled by default)_
1. Added new colorization options for alliances which your are at WAR with _(same as NAP/CAP capabilities)_

**Updates:**

1. Planet statistics output received an update in order to have better output
1. User script for TamperMonkey was renamed to "DarkGalaxy Plus" _(same as the Chrome extension)_
1. Experimental loading of images from the extension pack
1. Various adjustments related to rules changes in Andromeda 3 and Andromeda 4
1. Implemented capability to hide the "context menu" for "Scan Target" and "Jump To" if the user clicks elsewhere on the interface
1. Icons for "Scan Target" and "Jump To" context menus are now available throughout the entire interface and not in Navigation only
1. Planet sorting was extended to support "order by population"
1. Colorization of NAP/CAP/WAR alliancies is now also applied to planets _(wherever it's possible)_
1. Various optimizations and code clean-ups

**Bug Fixes:**

1. Now workers statistics is now taking into consideration "available living space" on each planet, thus providing accurate information.
1. Added checks for some elements in order to deactivate the script/extension if not logged in
1. Disabled Alt+Left / Alt+Right or Ctrl+Left / Ctrl+Right shorcuts for switching to previous/next for planets, fleets or navigation

## Version 0.4.0007
**New features:**

1. Nothing yet

**Updates:**

1. Added ships descriptions in the on-hover tips with basic targeting information, capacity, some tips and some flavor text where appropariate

**Bug Fixes:**

1. Nothing yet

## Version 0.4.0006

**New features:**

1. Capability to export the planet list with various details to a CSV file for download
1. Showing speed modifier buildings (ST/HB/JG) in planet list
1. During fleet transfers, available resources units and ships are automatically inputed by clicking on the appropriate resource/ship.

**Updates:**

1. Refactored generation of general statistics to be based on the provided JSON data
1. Introduced information about population and soldier growth in the general statistics
1. Introduced summary information about current construction (buildings, ships and soldiers)

**Bug Fixes:**

1. Fixed issue with the context menu for fleet orders not updating coordinates upon follow-up usage
1. Fixed issue with the context menu for scanning not updating coordinates upon follow-up usage
1. Fixed issue with planet navigation using arrow keys while inputting information in an input 
1. Fixed issue with missing coordinates within generated screenshots in some scenarios

## Version 0.4.0005

**New features:**

1. Added confirmation upon leaving the current alliance
1. Improved resource transfer on fleet actions
1. Shortcut for scanning a target planet from navigation
1. Created built-in CHANGELOG

**Updates:**

1. Updated bugfix for missing images *(added all buildings)*
1. Creating a new fleet now adds it to the fleetArray cache without having to visit the `Fleet List` page

**Bug Fixes:**

1. Fixed colorization in player rankings

**Removed:**

1. Unused input TODO/???? was removed from the configuration

## Version 0.4.0004

**New features:**

1. *Move to planet* icon was added in Navigation on each planet which provides handy shortcut to queue a fleet to move to that target
1. Overall planet statistics *(HTML & Markdown formatting)*
1. Logistic calculator in `Planet List` per planet
1. DG utilities built in help

**Updates:**

1. Minor code cleanup
1. Optimization for `Repeat` label workaround
1. Optimization for colorization based on NAP/CAP filters
1. Added userscript icon
1. Implemented bugfix for missing images for destroying buildings by replacing those with local images *(only basic mines are added at the current time)*

**Bug Fixes:**

1. Colorization now applies the same effect to the border of the planet
1. Fixed initial configuration initialization

**Removed:**

1. Some debug output was removed

## Version 0.4.0003

**New features:**

1. Capability to sort planets by planet name
1. Minor cleanup of the code

## Version 0.4.0002

**New features:**

1. Configuration via internal browser storage
1. Screenshot sender *(either to Discord webhook or to the clipboard)*
1. Added "labels" on `Repeat` and `All resources` for their respective checkboxes
1. Fixed coordinates width in navigation
1. Implemented fleet sorting (optional)
1. New notifications

**Removed:**

1. "Total population" patch has been removed as it is no longer needed

**Fixes:**

1. Fixed the JS to work with 4 digit coordinates
