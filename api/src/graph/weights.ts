/*
201100	Expressway
201101	Expressway Ramp
201200	Major Arterial
201201	Major Arterial Ramp
201300	Minor Arterial
201301	Minor Arterial Ramp
201400	Collector
201401	Collector Ramp
201500	Local
201600	Other
201601	Other Ramp
201700	Laneway
201800	Pending
201801	Busway
201803	Access Road
202001	Major Railway
202002	Minor Railway
203001	River
203002	Creek/Tributary
204001	Trail
204002	Walkway
205001	Hydro Line
206001	Major Shoreline
206002	Minor Shoreline (Land locked)
207001	Geostatistical line
208001	Ferry Route
*/

export const WEIGHTS: Record<number, number> = {
    201700: 1,
    201500: 1,
    205001: 0,
    201100: 0, // highway?
    201101: 0, // highway ramp?
    201200: 1,
    201201: 1,
    201300: 3, // minor highways? confrm you can even bike on these
    201301: 3, // minor highway ramp?
    201400: 2, // major road?
    201401: 2, // major road ramp?
    201600: 1,
    201601: 1,
    201800: 1,
    201801: 0,
    201803: 1,
    202001: 0,
    202002: 0,
    203001: 0,
    203002: 0,
    204001: 1,
    204002: 1,
    206001: 0,
    206002: 0,
    207001: 0,
    208001: 0,
  };