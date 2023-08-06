# dg-tools

**Description**

Basic Javascript fixes for DarkGalaxy beta released in May 2020. It fixes/augments the interface by acheiving the following modifications:
1. Colorizes friendly alliances player names and alliance tags (NAP and CAP coloring)
1. Player name tags are now having onclick event which will open the /mail/ system with predefined recipient
1. Mail system now supports TO variable which if set would set the recipient
1. Cancelling the top building/ship/soldier which is being built at the moment now requires confirmation
1. Implements planet navigation with ARROW KEYS (left and right) in building overview
1. Implements system navigation with ARROW KEYS (left and right) in galaxy and sector navigation
1. Implements switching through fleets with ARROW KEYS (left and right)
1. ~Show all population in the planet list and planet details page, not just available population~
1. Capability to send a screenshot to a Discord channel via user defined webhook (or copies it in the clipboard if such is not configured)
1. Sorting of planets by name (both planet listing and fleet navigation drop down)
1. Sorting of fleets by name in fleet listing
1. Sorting comms in the radar section based on turns
1. Smart inputs on coordinates in fleet orders and scanning (using dot and backspace now navigates between the coordinates)
1. Added confirmation on kicking members
1. Selecting scan type in comms can be done by clicking anywhere on the row
1. Minor bug fixes in DarkGalaxy front-end
1. Labels for `Repeat` and `All resources` are now activating the checkbox
1. Capability to select planet for fleet queuing from the *Navigation*
1. General planet income statistics
1. Logistics calculator per planet
1. Improved resources transfer with fleet orders

*There are more features which are not listed at the moment*

**Installation**

1. Download/install Tampermonkey plugin for your browser (https://www.tampermonkey.net/).
1. Enable Tampermonkey plugin
1. Open the link depending on the version
  * Stable https://github.com/Arcopix/dg-tools/raw/master/tools.user.js
  * Development https://github.com/Arcopix/dg-tools/raw/dg-tools-v4-dev/tools.user.js

**Special thanks**

* Mordread
  * for providing the base (used to be jQuery code) for some of the navigation
  * for providing the idea of sorting radars (still under testing)
  * for providing the initial implementation of the now defunct TOTAL POPULATION patch

* Sintelion
  * for providing the idea of TOTAL POPULATION patch

**Bugs and issues**

If you find any bugs or want to provide any feedback, feel free to open an issue on GitHub (https://github.com/Arcopix/dg-tools/issues) or message me in DarkGalaxy Discord.

**Warranty**

The open source software is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
applicable licenses for more details.

**License**

BSD 3-Clause License

Copyright (c) 2020, Devhex, Stefan Lekov
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
