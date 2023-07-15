# dg-tools

**Description**

Basic Javascript fixes for DarkGalaxy beta released in May 2020. It fixes/augments the interface by acheiving the following modifications:
1. Colorizes friendly alliances player names and alliance tags
1. Player name tags are now having onclick event which will open the /mail/ system with predefined recipient
1. Mail system now supports TO variable which if set would set the recipient
1. Cancelling the top building/ship/soldier which is being built at the moment now requires confirmation
1. Implements planet navigation with ARROW KEYS (left and right) in building overview
1. Implements system navigation with ARROW KEYS (left and right) in galaxy and sector navigation
1. Implements switching through fleets with ARROW KEYS (left and right)
1. ~Show all population in the planet list and planet details page, not just available population~
1. Sorts comms in the radar section based on turns
1. Smart inputs on coordinates in fleet orders and scanning (using dot and backspace now navigates between the coordinates)
1. Added confirmation on kicking members
1. Selecting scan type in comms can be done by clicking anywhere on the row

**Installation**

1. Download/install Tampermonkey plugin for your browser (https://www.tampermonkey.net/).
1. Enable Tampermonkey plugin
1. Click on "Create new script"
1. Paste the code in tools.js
1. Modify the configuration on line 15 and  (naps and color for naps):
  ```javascript
 /* Config start */
 var nap_ally = [ "[ALLY1]", "[ALLY2]" ]; // Which alliances you want to be color coded as NAP. Note the brackets.
 var custom_style = "COLOR: #FFD54F;"; // Color specified for NAP
 /* Config end */
  ```

**Special thanks**

* Mordread
  * for providing the base (used to be jQuery code) for some of the navigation
  * for providing the idea of sorting radars (still under testing)
  *  for providing the initial implementation of TOTAL POPULATION patch

* Sintelion
  * for providing the idea of TOTAL POPULATION patch

**Bugs and issues**

If you find any feel free to open an issue on GitHub (https://github.com/Arcopix/dg-tools/issues) or message me in DarkGalaxy forums.

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
