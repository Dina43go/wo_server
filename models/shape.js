const { timeTampsToDate } = require("../utils/utils");

class DataShape {

    static userProfile(data1 , data2) {
        return {
            lastName: data1[0].lastName,
            firstName1: data1[0].firstName1,
            firstName2: data1[0].firstName2,
            email: data1[0].email,
            tel: data1[0].tel,
            imgPath: data1[0].imgPath,
            profession: data1[0].profession,
            qrcodePath: data2[0].qrcodePath
        }
    }


    static hospitals(data) {
        let embeded=[];
        for(let index=0 ; index < data.length ; index ++) {
            embeded.push({
                hopitalProfileId: data[index].hopitalProfileId,
                designation: data[index].designation,
                email: data[index].email,
                tel: [data[index].tel_1,data[index].tel_2],
                position: {lng: parseFloat(data[index].lng) , lat: parseFloat(data[index].lat)},
                emergency: {
                    driverNumbers: data[index].driverNumbers,
                    disponibility: data[index].available? true: false,
                }
            });
        }
        return embeded;
    }

    static emergency(data) {
        
        return {
            driverNumbers: data[0].driverNumbers,
            disponibility: data[0].available
        };
    }

    static hospitalInfo(data) {
        return {
            id: data[0].hopitalProfileId,
            designation: data[0].designation,
            email: data[0].email,
            tel: [data[0].tel_1 , data[0].tel_2],
            adresse: data[0].adresse
        };
    }

    static patientInfo(data) {
        return {
            lastName: data[0].lastName,
            firstName: {
                1: data[0].firstName1,
                2: data[0].firstName2
            },
            imgPath: data[0].imgPath,
            age: new Date().getFullYear() - new Date(data[0].birthday).getFullYear(),
            sex: data[0].sex,
            adresse: data[0].adresse
        };
    }

    static alerteListe(data) {
        let embeded = [];
        for(let index=0 ; index < data.length ; index ++) {
            embeded.push({
                alerteId: data[index].alerteId,
                type: data[index].type,
                status: data[index].status,
                lastName: data[index].lastName,
                firstName2: data[index].firstName2,
                tel: data[index].tel,
                position: {
                    lng: data[index].lng,
                    lat: data[index].lat
                },
                createdAt: data[index].createdAt
            });
        }
        return embeded;
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

    static userconsultation(data) {
        let embeded=[];
        for(let index=0 ; index < data.length ; index ++) {
            embeded.push({
                    hopitalDesignation: data[index].hospital_designation,
                    doctorName: data[index].doctorName,
                    numberOrder: data[index].numberOrder,
                    constantes: [data[index].weigth , data[index].temp , data[index].pulse , data[index].TA],
                    traitement: [data[index].dominant_complainte , data[index].order_signe],

                    // pricing:[data[index].pricing_ref,data[index].pricing_trait].filter(data=> data != null),
                    pricing: {
                        traitement: data[index].pricing_trait =! null ? true : false,
                        ref: data[index].pricing_ref =! null ? true : false,
                    },
                    drugsDosage: data[index].drugs_dosages.split("£-£p"),
                    evolution: data[index].evolution,
                    status: data[index].status,
                    date: timeTampsToDate(data[index].createdAt)
                });
        }
        return embeded;
    }

    static antecedent(data) {
        const DT = data[0];
        return {
            allergy: {
                description: DT.al_description == null? "" : DT.al_description,
                // date: DT.al_updateAt
            },
            addiction: {
                data:[
                    DT.a_alcool,
                    DT.a_drogues,
                    DT.a_cigarettes,
                    DT.a_cafeines
                ].filter(data=> data != null),
                // date: DT.a_updateAt
            },
            antecedent_chirurgico: {
                description: DT.ch_description == null? "" : DT.ch_description,
                // date: DT.ch_updateAt
            },
            antecedent_familial: {
                data:[
                    DT.f_asthme,
                    DT.f_cancer,
                    DT.f_maladie_cardiovasculaire,
                    DT.f_diabete,
                    DT.f_hypertension,
                    DT.f_epilepsie
                ].filter(data=> data != null),
                description: DT.f_description == null? "" : DT.f_description,
                // date: DT.f_updateAt
            },
            antecedent_gynecho:{
                data:DT.g_state,
                // date:DT.g_updateAt
            },
            antecedent_medico: {
                data:[
                    DT.m_chest_pain,
                    DT.m_breathing_difficulties,
                    DT.m_cardiovascular_difficulties,
                    DT.m_hematological_problem,
                    DT.m_lymphatic_Problems,
                    DT.m_gastrointestinal_problem,
                    DT.m_genital_problem,
                    DT.m_weight_gain,
                    DT.m_weightloss,
                    DT.m_musculoskeletal_disorder,
                    DT.m_other
                ].filter(data=> data != null),
                description: DT.m_description == null? "" : DT.m_description,
                // date: DT.m_updateAt
            },
            advanced_health_information:{
                data:{
                    bloodGroupe: DT.ad_blood_groupe,
                    rh:DT.ad_rh,
                    electrophorese:DT.ad_electrophorese_hemoglobin
                },
                // date: DT.ad_updateAt
            }
        };
    }
}

module.exports = DataShape;