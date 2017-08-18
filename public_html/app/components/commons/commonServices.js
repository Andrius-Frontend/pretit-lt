angular.module('tyList.service', [])

.factory('Messages', function () {
    var messages = [{
        content: [],
        Users: []
    }];

    return messages;
})

.factory('Base64', function () {
    var code = 'data:image/jpeg;base64,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/wDfxMd+El897M9pjVAIMGg5c8MbOhRUUGYPAS+e0SASSATKEaOjmJsMEiYTJnKRI+9L57CwJIBQCFns7czKRiJ9RwA+5L56lbEMAE7C3wjoOajgTQK1PgHtS+esOYf05uFN0EEcT3B7EvnpB+NDud+cmJMBjtFBLYjEeqXxSBDNsEJFgMBzp9hEQ/36pfFDbV7DTnYjAcgxCMWkIluPRIg1uxz1mBv9vRH0ES3Yc9ENOBii6wgmQgG0TMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSZiTMSBkaElf/2gAMAwAAARECEQAAEAQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQawQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQawQQQQQQQQQQQSXLbz4wgQQQQQQQQQQQawQQQQQQQQQQd/fffffffAwQQQQQQQQQawQQQQQQQQQT/ffffffffWgQQQQQQQQQawQQQQQQQQRdvfffffffffagQQQQQQQQawQQQQQQQQQ/ffffffffffYAQQQQQQQQawQQQQQQQQQ/ffffffffffaQQQQQQQQQawQQQQQQQQQ/ffffffffffaQQQQQQQQQawQQQQQQQQQ/ffffffffffaQQQQQQQQQawQQQQQQQQUPffffffffffeAQQQQQQQQawQQQQQQQQd/ffffffffffawQQQQQQQQawQQQQQQQQV/ffffffffffawQQQQQQQQawQQQQQQQQcfffffffffffbgQQQQQQQQawQQQQQQQQVf/ffffffffeUgQQQQQQQQawQQQQQQQQQW/ffffffffdQQQQQQQQQQawQQQQQQQQQVvfffffffeSQQQQQQQQQQawQQQQQQQQQQWPffffffdQQQQQQQQQQQawQQQQQQQQQQVfffffffgQQQQQQQQQQQawQQQQQQQQQQVfffffffAQQQQQQQQQQQawQQQQQQQQQQVffffffeAQQQQQQQQQQQawQQQQQQQQQQSPfffffbYQQQQQQQQQQQawQQQQQQQQTfvfffffffbeTwQQQQQQQQawQQQQQQS9XfffffffffffbeTwQQQQQQawQQQQQT3fffffffffffffffbWQwQQQQawQQQRrMfffffffffffffffffeVpgQQQawQRVXfbWdffffffffffffffdXffXCwQawRVPffffbWdfffffffffecTffffffCwawffffffffffTXcceecdTXffffffffWiawHffffffffffffffffffffffffffffRa/vffffffffffffffffffffffffffffa4f8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wDh/8QAHREAAgMBAQEBAQAAAAAAAAAAAREAMDFAECAhUP/aAAgBAhEBPxDvGfwBlq9EieEbRlgFBDsGVhUQ6xnMdqGVDeYMqG8wZUN5gyobzBlQWEVDKscwyrHMM5hqGVAqwl1DK8coZWDUS6xlgLoKwZYD9m0ZxnLRnGctGWAUEKwZUA4BUYVQyhQXDCoGfY4h+wz5AcAXIoR8jPgDoIfwM9AXUQ4fzwZ4B2EPwZAGe4IMgHeMiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii8/8QAHhEAAgMAAgMBAAAAAAAAAAAAAAERMDEhQBAgUUH/2gAIAQERAT8QXf0Lv6FY0WjT8JfPBIX0hMt0Kv8AOg4JpqVXoVUfCqVXoVTS5raamhU4dmKtCpw7MVaFTh2Yq0KnDsxVoVMShWROKtC6otq0Lqi2rQqU5mxJaq0KlCQNQ4qSbcI0OrQqkhzVyTXoXTDSBFehVzqP3WaFWhIfukuBKLNC6WFuhVv3wt0KuNQqFpZoVKdDXlKbWH0EjyrQvdotGPLU2sPoJHlGhe4bb3oJtYfQTT5XtoXooN11GYFvfXQvP59g7gxNNSvOheMC7T2E01K8aET8LuSvGu/EnBokfeaHI3PJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJLP//EACoQAAECAwcEAwEBAQAAAAAAAAEAESFA8DFBUWGhsdEwcYGRIFDBEOHx/9oACAEAAAE/EKlifvtR2CqWJ++1HYKpYn77UdgqlifvtR2CqWJmwHLCJQUUrCQ9sgTg1ESEMrXisjRms0a8VXtdllgApazmo7BVLEzA8SL0SggwoflAeymAgRd/zDBFQUbQB3r5kA2gFB3I2gfYIo4S8bBjK46oMTY9t3FukzqOwVSxMsQACSLAAWoqxsRYWZuu93IDAlwW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';

    return code;
})

.factory('loginCredits', function () {
    var login = {
        jurisdiction: 'private',
        password: '',
        email: '',
        data: {
            name: "",
            surname: "",
            gender: 'women',
            telNumber: '+370',
            address: {
                show: true,
                city: '',
                street: '',
                number: ''
            },
            about: ''
        }
    };

    return login;
})

.factory('cityList', function () {
    var cities = [
        'Pasirinkite miestą',
        'Vilnius',
        'Kaunas',
        'Klaipėda',
        'Šiauliai',

        'Panevėžys',
'Alytus',
        'Akmenė',
'Anykščiai',
'Ariogala',
'Baltoji Vokė',
'Birštonas',
'Biržai',
'Daugai',
'Druskininkai',
'Dūkštas', 'Dusetos',
'Eišiškės',
'Elektrėnai',
'Ežerėlis',
'Gargždai',
'Garliava',
'Gelgaudiškis',
'Grigiškės',
'Ignalina',
'Jieznas',
'Jonava',
'Joniškėlis',
'Joniškis',
'Jurbarkas',
'Kaišiadorys',
'Kalvarija',

'Kavarskas',
'Kazlų Rūda',
'Kėdainiai',
'Kelmė',
'Kybartai',

'Kretinga',
'Kudirkos Naumiestis',
'Kupiškis',
'Kuršėnai',
'Lazdijai',
'Lentvaris',
'Linkuva',
'Marijampolė',
'Mažeikiai',
'Molėtai',
'Naujoji Akmenė',
'Nemenčinė',
'Neringa',
'Nida',
'Obeliai',
'Pabradė',
'Pagėgiai',
'Pakruojis',
'Palanga',
'Pandėlys',
'Panemunė',

'Pasvalys',
'Plungė',
'Priekulė',
'Prienai',
'Radviliškis',
'Ramygala',
'Raseiniai',
'Rietavas',
'Rokiškis',
'Rūdiškės',
'Salantai',
'Seda',
'Simnas',
'Skaudvilė',
'Skuodas',
'Smalininkai',
'Subačius',
'Šakiai',
'Šalčininkai',
'Šeduva',

'Šilalė',
'Šilutė',
'Širvintos',
'Švenčionėliai',
'Švenčionys',
'Tauragė',
'Telšiai',
'Tytuvėnai',
'Trakai',
'Troškūnai',
'Ukmergė',
'Utena',
'Užventis',
'Vabalninkas',
'Varėna',
'Varniai',
'Veisiejai',
'Venta',
'Viekšniai',
'Vievis',
'Vilkaviškis',
'Vilkija',

'Virbalis',
'Visaginas',
'Zarasai',
'Žagarė',
'Žiežmariai'];


    return cities;
})

.factory('Users', function () {
    var users = [];

    return users;
})

.factory('WorkingDaysTimes', function () {
    var workingDays = {
        0: {
            hourFrom: "9:00",
            hourTo: "17:00",
            working: false
        },


        1: {
            hourFrom: "9:00",
            hourTo: "17:00",
            working: true
        },
        2: {
            hourFrom: "9:00",
            hourTo: "17:00",
            working: true
        },
        3: {
            hourFrom: "9:00",
            hourTo: "17:00",
            working: true
        },
        4: {
            hourFrom: "9:00",
            hourTo: "17:00",
            working: true
        },
        5: {
            hourFrom: "9:00",
            hourTo: "17:00",
            working: true
        },
        6: {
            hourFrom: "9:00",
            hourTo: "17:00",
            working: false
        }
    }
    return workingDays;
})

.factory('Services', function () {
    var services = [{
            name: 'Kirpimas',
            subcategories: [{
                    name: "Moterų kirpimas",
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
        },
                {
                    name: 'Vyrų kirpimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Proginė šukuosena',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Nuotakos šukuosena',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Plaukų tiesinimas keratinu',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Šilko terapija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Plaukų priauginimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Plaukų dažymas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Plaukų šukavimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Cheminis šukavimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                },
                {
                    name: 'Vaikų kirpimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
                }]
        },
        {
            name: "Manikiūras",
            subcategories: [{
                    name: 'Nagu daile',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Manikiuras',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Ilgalaikis gelinis lakavimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Paprastas lakavimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Karštas manikiuras',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Pedikiūras',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Ilgalaikio lakavimo nuvalymas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Parafino vonelė',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Antakių korekcija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Antakių dažymas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Blakstienų dažymas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Gelinis nagų priauginimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Akrilinis nagų priauginimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Gelinių nagų papildimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Akrilinių nagų papildimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            }]
        }, {
            name: 'Kosmetologija',
            subcategories: [{
                    name: 'Blakstienų priauginimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Blakstienų papildymas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: '6D antakiai',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Antakių ilgalaikis makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Akių vokų ilgalaikis makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Lūpų ilgalaikis makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Ilgalaikio makiažo korekcija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Auskarų vėrimas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Blauzdų depiliacija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Kojų depiliacija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Rankų depiliacija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Pažastų depiliacija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Bikini depiliacija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Veido srities depiliacija',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Veido valymas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Veido masažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            }]
        }, {
            name: 'Vizažas',
            subcategories: [
                {
                    name: 'Proginis makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Dalykinis makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Dieninis makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Vestuvinis makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Specialiųjų efektų makiažas',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            },
                {
                    name: 'Privačios makiažo pamokos',
                    price: 10,
                    doing: false,
                    time: "30",
                    duration: '1'
            }]
        }
                   ];

    return services;
})

.factory('Times', function () {
    var times = {
        01: {
            time: "7:00",
            availability: true,
            id: 1,
            registeredService: {}
        },
        02: {
            time: "7:30",
            availability: true,
            id: 2,
            registeredService: {}
        },
        03: {
            time: "8:00",
            availability: true,
            id: 3,
            registeredService: {}
        },
        04: {
            time: "8:30",
            availability: true,
            id: 4,
            registeredService: {}
        },
        05: {
            time: "9:00",
            availability: true,
            id: 5,
            registeredService: {}
        },
        06: {
            time: "9:30",
            availability: true,
            id: 6,
            registeredService: {}
        },
        07: {
            time: "10:00",
            availability: true,
            id: 7,
            registeredService: {}
        },
        08: {
            time: "10:30",
            availability: true,
            id: 8,
            registeredService: {}
        },
        09: {
            time: "11:00",
            availability: true,
            id: 9,
            registeredService: {}
        },
        10: {
            time: "11:30",
            availability: true,
            id: 10,
            registeredService: {}
        },
        11: {
            time: "12:00",
            availability: true,
            id: 11,
            registeredService: {}
        },
        12: {
            time: "12:30",
            availability: true,
            id: 12,
            registeredService: {}
        },
        13: {
            time: "13:00",
            availability: true,
            id: 13,
            registeredService: {}
        },
        14: {
            time: "13:30",
            availability: true,
            id: 14,
            registeredService: {}
        },
        15: {
            time: "14:00",
            availability: true,
            id: 15,
            registeredService: {}
        },
        16: {
            time: "14:30",
            availability: true,
            id: 16,
            registeredService: {}
        },
        17: {
            time: "15:00",
            availability: true,
            id: 17,
            registeredService: {}
        },
        18: {
            time: "15:30",
            availability: true,
            id: 18,
            registeredService: {}
        },
        19: {
            time: "16:00",
            availability: true,
            id: 19,
            registeredService: {}
        },
        20: {
            time: "16:30",
            availability: true,
            id: 20,
            registeredService: {}
        },
        21: {
            time: "17:00",
            availability: true,
            id: 21,
            registeredService: {}
        },
        22: {
            time: "17:30",
            availability: true,
            id: 22,
            registeredService: {}
        },
        23: {
            time: "18:00",
            availability: true,
            id: 23,
            registeredService: {}
        },
        24: {
            time: "18:30",
            availability: true,
            id: 24,
            registeredService: {}
        },
        25: {
            time: "19:00",
            availability: true,
            id: 25,
            registeredService: {}
        },
        26: {
            time: "19:30",
            availability: true,
            id: 26,
            registeredService: {}
        },
        27: {
            time: "20:00",
            availability: true,
            id: 27,
            registeredService: {}
        },
        28: {
            time: "20:30",
            availability: true,
            id: 28,
            registeredService: {}
        },
        29: {
            time: "21:00",
            availability: true,
            id: 29,
            registeredService: {}
        },
        30: {
            time: "21:30",
            availability: true,
            id: 30,
            registeredService: {}
        },
        31: {
            time: "22:00",
            availability: true,
            id: 31,
            registeredService: {}
        }
    };
    return times;
})


//.service('CommonService', function ($localStorage, $arrayUtil) {
//    this.status = {
//        showDelete: false
//    }
//
//    /**
//     * Add new person
//     */
//    this.add = function (person) {
//        var insuredPersons = $localStorage.getObjectList('insuredPersons', '[]');
//        //        person.personId = insuredPersons.length + 1;
//        person.personId = Math.random();
//        insuredPersons.push(person);
//        $localStorage.setObjectList('insuredPersons', insuredPersons);
//    };
//
//    /**
//     * Remove person
//     */
//    this.remove = function (person) {
//        var insuredPersons = $localStorage.getObjectList('insuredPersons', '[]');
//        insuredPersons = $arrayUtil.removeById(insuredPersons, person.personId);
//        $localStorage.setObjectList('insuredPersons', insuredPersons);
//    }
//
//    /**
//     * Get all persons
//     */
//    this.getAll = function () {
//        var insuredPersons = $localStorage.getObjectList('insuredPersons', '[]');
//        return insuredPersons;
//    }
//});