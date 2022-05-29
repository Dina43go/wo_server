const { timeTampsToDate } = require("../utils/utils");

class DataShape {

    static hospitals(data) {
        let embeded=[];
        for(let index=0 ; index < data.length ; index ++) {
            embeded.push({
                hopitalProfileId: data[index].hopitalProfileId,
                designation: data[index].designation,
                email: data[index].email,
                tel: [data[index].tel_1,data[index].tel_2],
                position: {lng: data[index].lng , lat: data[index].lat},
                emergency: {
                    driverNumbers: data[index].driverNumbers,
                    disponibility: data[index].available? true: false,
                }
            });
        }
        return embeded;
    }

    static emergency(data) {
        
        return [{
            driverNumbers: data[0].driverNumbers,
            disponibility: data[0].available
        }];
    }

    static hospitalInfo(data) {
        return [{
            id: data[0].hopitalProfileId,
            designation: data[0].designation,
            email: data[0].email,
            tel: [data[0].tel_1 , data[0].tel_2],
            adresse: data[0].adresse
        }];
    }

    static patientInfo(data) {
        return [{
            lastName: data[0].lastName,
            firstName: {
                1: data[0].firstName1,
                2: data[0].firstName2
            },
            age: new Date().getFullYear() - new Date(data[0].birthday).getFullYear(),
            sex: [data[0].sex],
            adresse: data[0].adresse
        }];
    }

    static consultation(data) {
        let embeded=[];
        for(let index=0 ; index < data.length ; index ++) {
            embeded.push({
                    hopitalDesignation: data[index].hospital_designation,
                    doctorName: data[index].doctorName,
                    numberOrder: data[index].numberOrder,
                    constantes: {
                        weigth: data[index].weigth,
                        pulse: data[index].pulse,
                        temps: data[index].temp,
                        TA: data[index].TA
                    },
                    dominantComplainte:data[index].dominant_complainte,
                    orderSigne:data[index].order_signe,
                    pricing:[data[index].pricing_ref,data[index].pricing_trait].filter(data=> data != null),
                    drugsDosage: data[index].drugs_dosages.split("£-£p"),
                    evolution: data[index].evolution,
                    status: data[index].status,
                    date: timeTampsToDate(data[index].createdAt)
                });
        }
        return embeded;
    }
}

module.exports = DataShape;