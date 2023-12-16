::: danger Under Construction
This page is in active development and may undergo frequent changes.
:::

Counters are represented by unique hexadecimal value, starting with 0x1, the value for Spell counters. Even if the English text of some cards like **BOXer** or **Kickfire** refers only to "Counter" (i.e. not giving it an specific name), those counters are considered to be different from each other. Counters are grouped in two categories.

- Global counter
- Permission counters

## Global Counters

Counters with a value **above** 0x1000 are considered global, meaning that any card can receive this type of counter. Example: Predator Counter (0x1041).

## Permission-specific counters

Counters with a value **below** 0x1000 have to be first permitted on the card that is going to hold such counters before they can be added. If the card that has these counters permitted has its effects negated, it also loses the ability to hold such counter. Example: Spell Counter (0x1)

## Functions related to counters

The following functions are related to counter permission and limits and must be used with the initial effect registration:

```c++
void Card.EnableCounterPermit(Card c, int countertype[, int location])
```

Makes the card (Card c) able to hold a type of counter (int countertype). If a the optional parameter (int location) is provided, the card will be able to hold the counter(s) only when in the specified location.

```c++
void Card.SetCounterLimit(card c, int counter_type, int count)
```

Sets the limit (int count) of how many counters of a type (int countertype) can be held by a card (Card c).

## List of counters

As of 21-Jun-2022, the following counters are in use in Edopro:

### Counters for official cards:

| Value  | Counter                                          |
| ------ | ------------------------------------------------ |
| 0x1    | Spell Counter                                    |
| 0x1002 | Wedge Counter                                    |
| 0x3    | Bushido Counter                                  |
| 0x4    | Psychic Counter                                  |
| 0x5    | Shine Counter                                    |
| 0x6    | Crystal Counter                                  |
| 0x7    | Counter (Colosseum Cage of the Gladiator Beasts) |
| 0x8    | Morph Counter                                    |
| 0x1009 | Venom Counter                                    |
| 0xa    | Genex Counter                                    |
| 0xb    | Counter(Ancient City)                            |
| 0xc    | Thunder Counter                                  |
| 0xd    | Greed Counter                                    |
| 0x100e | A-Counter                                        |
| 0xf    | Worm Counter                                     |
| 0x10   | Black Feather Counter                            |
| 0x11   | Hyper Venom Counter                              |
| 0x12   | Karakuri Counter                                 |
| 0x13   | Chaos Counter                                    |
| 0x14   | Counter (Miracle Jurassic Egg)                   |
| 0x1015 | Ice Counter                                      |
| 0x16   | Spellstone Counter                               |
| 0x17   | Nut Counter                                      |
| 0x18   | Flower Counter                                   |
| 0x1019 | Fog Counter                                      |
| 0x1a   | Payback Counter                                  |
| 0x1b   | Clock Counter                                    |
| 0x1c   | D Counter                                        |
| 0x1d   | Junk Counter                                     |
| 0x1e   | Gate Counter                                     |
| 0x1f   | Counter(B.E.S.)                                  |
| 0x20   | Plant Counter                                    |
| 0x1021 | Guard Counter                                    |
| 0x22   | Dragonic Counter                                 |
| 0x23   | Ocean Counter                                    |
| 0x1024 | String Counter                                   |
| 0x25   | Chronicle Counter                                |
| 0x26   | Counter (Metal Shooter)                          |
| 0x27   | Counter (Des Mosquito)                           |
| 0x28   | Counter (Dark Catapulter)                        |
| 0x29   | Counter (Balloon Lizard)                         |
| 0x102a | Counter (Magic Reflector)                        |
| 0x2c   | You Got It Boss! Counter                         |
| 0x2d   | Counter (Kickfire)                               |
| 0x2e   | Shark Counter                                    |
| 0x2f   | Pumpkin Counter                                  |
| 0x30   | Hi-Five the Sky Counter                          |
| 0x2b   | Destiny Counter                                  |
| 0x31   | Rising Sun Counter                               |
| 0x32   | Balloon Counter                                  |
| 0x33   | Yosen Counter                                    |
| 0x34   | Counter (BOXer)                                  |
| 0x35   | Symphonic Counter                                |
| 0x36   | Performage Counter                               |
| 0x37   | Kaiju Counter                                    |
| 0x1038 | Cubic Counter                                    |
| 0x1039 | Zushin Counter                                   |
| 0x40   | Counter (Number 51: Finisher the Strong Arm)     |
| 0x1041 | Predator Counter                                 |
| 0x42   | Counter (Fire Cracker)                           |
| 0x43   | Defect Counter                                   |
| 0x44   | Counter (Beltlink Wall Dragon)                   |
| 0x1045 | Scale Counter                                    |
| 0x46   | Counter (Gouki Cage Match)                       |
| 0x47   | Counter (Limit Code)                             |
| 0x48   | Counter (Link Turret)                            |
| 0x1049 | Patrol Counter                                   |
| 0x4a   | Athlete Counter                                  |
| 0x95   | Rising Sun Counter                               |
| 0x147  | Borrel Counter                                   |
| 0x148  | Summon Counter                                   |
| 0x1148 | Signal Counter                                   |
| 0x1149 | Venemy Counter                                   |
| 0x14a  | Counter (Turntrooper)                            |
| 0x14b  | Counter (Battlewasp Nest)                        |
| 0x14c  | Counter (Firewall Dragon Darkfluid)              |
| 0x14d  | Counter (Seraphim Papillon)                      |
| 0x14e  | Counter (Cauldron of the Old Man)                |
| 0x14f  | Counter (World Legacy's Continuation)            |
| 0x200  | Counter (Pendulum of Souls)                      |
| 0x201  | Fire Fist Counter                                |
| 0x202  | Phantasm Counter                                 |
| 0x203  | Counter (Nezumihanabi)                           |
| 0x59   | Otoshidamashi Counter                            |
| 0x204  | Counter(Ursarctic Big Dipper)                    |
| 0x205  | Counter(War Rock Ordeal)                         |
| 0x206  | Counter(Sacred Scrolls of the Gizmek Legend)     |
| 0x207  | Emperor's Key Counter                            |
| 0x208  | Counter(Life Shaver)                             |
| 0x209  | Counter(Ursarctic Radiation)                     |
| 0x20a  | Piece Counter                                    |
| 0x20b  | Counter(Prisoner of Destiny)                     |
| 0x20c  | G Golem Counter                                  |
| 0x1207 | Burnup Counter                                   |

### Counters for non-official cards:

| Value  | Counter                     |
| ------ | --------------------------- |
| 0x55   | Hammer Counter              |
| 0x90   | Maiden Counter              |
| 0x91   | Speed Counter               |
| 0x92   | Plasma Counter              |
| 0x93   | Sacred Beast Counter        |
| 0x94   | Earthbound Immortal Counter |
| 0x95   | Crest Counter               |
| 0x96   | Battle Buffer Counter       |
| 0x99   | Full Moon Counter           |
| 0x103  | Medal Counter               |
| 0x107  | Gearspring Counter          |
| 0x584  | Counter (Ai Ai Wall)        |
| 0x1045 | Scale Counter               |
| 0x1090 | Maiden Counter              |
| 0x1096 | Protection Counter          |
| 0x1097 | Des Counter                 |
| 0x1098 | Chain Counter               |
| 0x109a | Scab Counter                |
| 0x1100 | Aura Counter                |
| 0x1101 | Hallucination Counter       |
| 0x1102 | Gear Counter                |
| 0x1104 | Thorn Counter               |
| 0x1105 | Turn Counter                |
| 0x1106 | Shield Counter              |
| 0x1107 | Prey Counter                |
| 0x1108 | Vaccine Counter             |
| 0x1109 | Life Star Counter           |
| 0x1110 | Beacon Counter              |
| 0x1112 | Disturbance Counter         |
| 0x1113 | Charge Counter              |
| 0x1115 | G Golem Counter             |
| 0xfb   | Trickstar Counter           |
| 0x577  | Hydradrive Counter          |
