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


module.exports= {hospitals};