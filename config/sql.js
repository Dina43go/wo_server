const hospitals = `
    select 
        H.hopitalProfileId , H.designation , H.email , H.tel_1 , H.tel_2 , 
        P.lng , P.lat,
        E.driverNumbers , E.available
    from hopital_profil as H
    inner join emergency as E
    on H.hopitalProfileId = E.hopitalProfilesId

    inner join positions as P
    on H.hopitalProfileId = P.refererId
`;

const antecedents = (id)=>{
    return `
        select 

        A.alcool as a_alcool, A.drogues as a_drogues, A.cigarettes as a_cigarettes, A.cafeines as a_cafeines, A.updateAt as a_updateAt,
		Al.description as al_description, Al.updateAt as al_updateAt,
		Ch.description as ch_description, Ch.updateAt as ch_updateAt,
		F.asthme as f_asthme, F.cancer as f_cancer, F.maladie_cardiovasculaire as f_maladie_cardiovasculaire, F.diabete as f_diabete, F.hypertension as f_hypertension, F.epilepsie as f_epilepsie, F.description as f_description, F.updateAt as f_updateAt,
		G.state as g_state, G.updateAt as g_updateAt,
		M.chest_pain as m_chest_pain, M.breathing_difficulties as m_breathing_difficulties, M.cardiovascular_difficulties as m_cardiovascular_difficulties, M.hematological_problem as m_hematological_problem, M.lymphatic_Problems as m_lymphatic_Problems, M.gastrointestinal_problem as m_gastrointestinal_problem, M.genital_problem as m_genital_problem, M.weight_gain as m_weight_gain, M.weightloss as m_weightloss, M.musculoskeletal_disorder as m_musculoskeletal_disorder, M.other as m_other, M.description as m_description, M.updateAt as m_updateAt,
		Ad.blood_groupe as ad_blood_groupe, Ad.rh as ad_rh, Ad.electrophorese_hemoglobin as ad_electrophorese_hemoglobin, Ad.updateAt as ad_updateAt

        from profiles P

        inner join addiction A
        on P.addiction_fk = A.id

        inner join allergy Al
        on P.allergy_fk = Al.id

        inner join antecedent_chirurgico Ch
        on P.chirurgico_fk = Ch.id

        inner join antecedent_familial F
        on P.familial_fk = F.id

        inner join antecedent_gynecho G
        on P.gynecho_fk = G.id

        inner join antecedent_medico M
        on P.medico_fk = M.id

        inner join advanced_health_information Ad
        on P.advanced_health_fk = Ad.id

        where userId_fk = "${id}"
    `;
}

const alerte = (min , max)=> {
    return  `
    select 
    A.alerteId,
    A.type,
    A.status,

    P.lastName,
    P.firstName2,
    P.tel,

    Po.lng,
    Po.lat,
    Po.createdAt
    
    from profiles P
    inner join alerte A
    on P.userId_fk = A.profile_fk
    inner join positions Po
    on A.alerteId = Po.refererId
    limit ${min},${max};
`;
}

const doctorHospitalList = (id)=> {
    return `
        select distinct doctorId,
        P.lastName,P.firstName1,P.firstName2, P.imgPath , P.profession ,P.tel,U.mail
                    
        from consultation C
        inner join profiles P
        on C.doctorId = P.profileId
        inner join users U
        on P.userId_fk = U.userId
        where C.hopital_profile_fk = "${id}"
    `;
}

// const doctorHospitalList = (id)=> {
//     return `
//         select distinct doctorId,
//         P.lastName,P.firstName1,P.firstName2 , P.imgPath ,P.tel,U.mail
                    
//         from consultation C
//         inner join profiles P
//         on C.doctorId = P.userId_fk
//         inner join users U
//         on C.doctorId = U.userId
//         where C.hopital_profile_fk = "${id}"
//     `;
// }

module.exports= {hospitals , antecedents , alerte , doctorHospitalList};