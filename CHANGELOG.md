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