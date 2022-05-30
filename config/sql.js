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
        select * 
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


module.exports= {hospitals , antecedents};