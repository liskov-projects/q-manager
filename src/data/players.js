const players = [
  {
    id: "1",
    names: "Jo vs Mike",
    category: "male",
    phoneNumbers: ["0495 333 222", "0495 321 123"]
  },
  {
    id: "2",
    names: "Phil vs Clive",
    category: "male",
    phoneNumbers: ["0455 535 321", "0444 434 341"]
  },
  {
    id: "3",
    names: "Rick vs Nick",
    category: "male",
    phoneNumbers: ["0455 905 900", "0475 396 099"]
  },
  {
    id: "4",
    names: "Moe vs Alan",
    category: "male",
    phoneNumbers: ["0434 335 654", "0484 392 201"]
  },
  {
    id: "5",
    names: "Jack vs Kyle",
    category: "male",
    phoneNumbers: ["0465 478 512", "0493 372 282"]
  },
  {
    id: "6",
    names: "Dan vs Chris",
    category: "male",
    phoneNumbers: ["0433 562 728", "0462 563 487"]
  },
  {
    id: "7",
    names: "Ted vs Vince",
    category: "male",
    phoneNumbers: ["0485 903 773", "0466 839 281"]
  },
  {
    id: "8",
    names: "Matt vs Glen",
    category: "male",
    phoneNumbers: ["0472 493 150", "0456 783 218"]
  },
  {
    id: "9",
    names: "Paul vs Sean",
    category: "male",
    phoneNumbers: ["0468 224 342", "0457 558 924"]
  },
  {
    id: "10",
    names: "Tom vs Sam",
    category: "male",
    phoneNumbers: ["0476 329 810", "0481 123 594"]
  },
  {
    id: "11",
    names: "James vs Liam",
    category: "male",
    phoneNumbers: ["0432 905 415", "0463 329 612"]
  },
  {
    id: "12",
    names: "Harry vs Max",
    category: "male",
    phoneNumbers: ["0492 415 297", "0459 312 213"]
  },
  {
    id: "13",
    names: "Evan vs Isaac",
    category: "male",
    phoneNumbers: ["0474 897 525", "0446 932 411"]
  },
  {
    id: "14",
    names: "Fred vs Lucas",
    category: "male",
    phoneNumbers: ["0451 992 712", "0435 602 935"]
  },
  {
    id: "15",
    names: "Josh vs Jared",
    category: "male",
    phoneNumbers: ["0497 223 919", "0467 553 821"]
  },
  {
    id: "16",
    names: "Aiden vs Simon",
    category: "male",
    phoneNumbers: ["0458 663 924", "0487 223 412"]
  },
  {
    id: "17",
    names: "Scott vs Ben",
    category: "male",
    phoneNumbers: ["0448 993 624", "0494 731 402"]
  },
  {
    id: "18",
    names: "Tyler vs Alex",
    category: "male",
    phoneNumbers: ["0462 584 101", "0483 498 132"]
  },
  {
    id: "19",
    names: "David vs Luke",
    category: "male",
    phoneNumbers: ["0456 924 410", "0431 504 320"]
  },
  {
    id: "20",
    names: "Owen vs Charlie",
    category: "male",
    phoneNumbers: ["0476 902 417", "0493 876 214"]
  },
  {
    id: "21",
    names: "Jack vs Eric",
    category: "male",
    phoneNumbers: ["0439 732 221", "0482 923 117"]
  },
  {
    id: "22",
    names: "Jordan vs Marcus",
    category: "male",
    phoneNumbers: ["0469 153 381", "0489 914 228"]
  },
  {
    id: "23",
    names: "Riley vs Justin",
    category: "male",
    phoneNumbers: ["0459 441 413", "0437 929 421"]
  },
  {
    id: "24",
    names: "Aaron vs Ethan",
    category: "male",
    phoneNumbers: ["0445 830 221", "0454 589 121"]
  },
  {
    id: "25",
    names: "Ryan vs Gavin",
    category: "male",
    phoneNumbers: ["0498 200 412", "0475 115 239"]
  },
  {
    id: "26",
    names: "Dean vs Colin",
    category: "male",
    phoneNumbers: ["0466 392 710", "0485 573 914"]
  },
  {
    id: "27",
    names: "Shawn vs Brent",
    category: "male",
    phoneNumbers: ["0451 473 392", "0463 492 111"]
  },
  {
    id: "28",
    names: "Kurt vs Zach",
    category: "male",
    phoneNumbers: ["0486 400 905", "0443 819 213"]
  },
  {
    id: "29",
    names: "Victor vs Wes",
    category: "male",
    phoneNumbers: ["0469 561 401", "0482 629 002"]
  },
  {
    id: "30",
    names: "Brady vs Dylan",
    category: "male",
    phoneNumbers: ["0453 934 120", "0438 593 426"]
  },
  {
    id: "31",
    names: "Carl vs Patrick",
    category: "male",
    phoneNumbers: ["0465 928 117", "0479 823 220"]
  },
  {
    id: "32",
    names: "Louis vs Greg",
    category: "male",
    phoneNumbers: ["0481 105 222", "0444 722 199"]
  },
  {
    id: "33",
    names: "Clint vs Bruce",
    category: "male",
    phoneNumbers: ["0463 712 914", "0457 802 110"]
  },
  {
    id: "34",
    names: "Ray vs Leon",
    category: "male",
    phoneNumbers: ["0433 649 131", "0449 772 420"]
  },
  {
    id: "35",
    names: "Roy vs Brett",
    category: "male",
    phoneNumbers: ["0496 892 314", "0471 530 213"]
  },
  {
    id: "36",
    names: "Neil vs Doug",
    category: "male",
    phoneNumbers: ["0458 402 124", "0484 811 622"]
  },
  {
    id: "37",
    names: "Geoff vs Stefan",
    category: "male",
    phoneNumbers: ["0462 995 335", "0447 883 522"]
  },
  {
    id: "38",
    names: "Martin vs Pete",
    category: "male",
    phoneNumbers: ["0477 882 211", "0436 634 392"]
  },
  {
    id: "39",
    names: "Troy vs Brad",
    category: "male",
    phoneNumbers: ["0491 484 314", "0483 234 915"]
  },
  {
    id: "40",
    names: "Frank vs Hank",
    category: "male",
    phoneNumbers: ["0443 119 430", "0478 331 524"]
  },
  {
    id: "41",
    names: "Reed vs Casey",
    category: "male",
    phoneNumbers: ["0459 223 419", "0439 559 612"]
  },
  {
    id: "42",
    names: "Jake vs Nathan",
    category: "male",
    phoneNumbers: ["0442 438 712", "0490 204 534"]
  },
  {
    id: "43",
    names: "George vs Blake",
    category: "male",
    phoneNumbers: ["0469 314 509", "0487 394 632"]
  },
  {
    id: "44",
    names: "Logan vs Rex",
    category: "male",
    phoneNumbers: ["0468 532 323", "0454 982 620"]
  },
  {
    id: "45",
    names: "Travis vs Nolan",
    category: "male",
    phoneNumbers: ["0471 382 920", "0438 204 233"]
  },
  {
    id: "46",
    names: "Clark vs Derek",
    category: "male",
    phoneNumbers: ["0480 725 442", "0467 113 233"]
  },
  {
    id: "47",
    names: "Ken vs Quinn",
    category: "male",
    phoneNumbers: ["0472 423 615", "0434 991 523"]
  },
  {
    id: "48",
    names: "Harvey vs Seth",
    category: "male",
    phoneNumbers: ["0489 331 928", "0460 292 914"]
  },
  {
    id: "49",
    names: "Ed vs Ian",
    category: "male",
    phoneNumbers: ["0499 905 392", "0437 663 721"]
  },
  {
    id: "50",
    names: "Tommy vs Mike",
    category: "male",
    phoneNumbers: ["0482 330 113", "0495 321 123"]
  }
];
export default players;
