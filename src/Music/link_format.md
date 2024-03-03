- Tempo  
- Key  
- Chords:
	- Offset (note, 0-12)
		- 4 bits
	- Mode (Root, Major, Minor, Sus2, Sus4)
		- 4 bits (in case we want to add more)
	- Length (up to 16)
		- 4 bits
	- Extensions
		- Each can be off, flat, natural, or sharp
		- 7th
		- 9th
		- 11th
		- 2 bits each
	- 3 base64 characters per chord

120C#4; YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST YST 
120C#4;YSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYSTYST

Offset    Mode   Length    Extensions
0110      0001   0010      010011
011000 010010 010011
Y      S      T

YST = 3 bars of Major 6th flat 7 sharp 11