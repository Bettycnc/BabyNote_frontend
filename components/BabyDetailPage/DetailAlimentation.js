import Alimentation from "./detailComponents/alimentation";
import styles from '../../styles/styles_detailPage/Detail.module.css';
import { useEffect, useState } from "react";
import {useSelector } from "react-redux";

function DetailAlimentation() {
    const [baby, setBaby] = useState(null);
    const user = useSelector((state) => state.user.value);
    

    useEffect(() => {
        fetch(`http://localhost:3000/babyData/${user.babies[0]._id}/alimentation`)
            .then(response => response.json())
            .then(data => {
                setBaby(data.data);
            });
    }, []);

    if (!baby) {
        return <p>Chargement...</p>;
    }

    const handelUpdate = (id) => {
        console.log(id)
    }

    const data = baby
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((data, i) => {
        // Vérifier si c'est un biberon ou allaitement
        const hasFeedingBottle = data.feedingBottle.length > 0;
        const feedingData = hasFeedingBottle ? data.feedingBottle[0] : null;
        
        // Vérifier s'il y a une donnée d'allaitement
        const breastData = !hasFeedingBottle && data.breastFeeding.length > 0 ? data.breastFeeding[0] : null;
    
        // Vérifier si un complément alimentaire est présent
        const complement = breastData && breastData.foodSupplement && breastData.foodSupplement.length > 0 
            ? breastData.foodSupplement[0] 
            : null;
        
        return (
            <Alimentation 
                key={i} 
                image={hasFeedingBottle ? "/Biberon.svg" : "/allaitement.svg"} // Adapter l'image
                date={new Date(data.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                biberon={hasFeedingBottle} 
                amount={hasFeedingBottle ? feedingData.amount : null} 
                which={breastData ? breastData.breast[1] !== undefined ?`${breastData.breast[0]}, ${breastData.breast[1]}` : breastData.breast[0] : "N/A"}
                duration={breastData ? breastData.duration : null} 
                complement={complement ? complement.foodSupplementPresent : false}
                complementType={complement ? complement.nameFoodSupplement : null} 
                complementMethode={complement ? complement.method : null} 
                complementAmount={complement ? complement.amount : null} 
                onClickSelect={() =>handelUpdate(data._id)} 
            />
        );
    });
    
    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <img className={styles.babyPicture} alt="Photo du bébé" />
                <p className={styles.babyName}>{user.babies[0].name}</p>
                <img src="/BurgerMenu.svg" alt="Menu" className={styles.BurgerMenu} />
            </div>

            {/* body */}
            <div>
                {data}
            </div>
        </div>
    )

}

export default DetailAlimentation;
