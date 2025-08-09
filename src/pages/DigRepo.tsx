import DigitalRepository from '../comps/DigrepoComps/DigReposHero'
import WhereToStartSection from '../comps/DigrepoComps/DigRepos'
import { useEffect, useState } from 'react'
import DigitalHeritagePlatform from '../comps/sharedComps/Navbar';
import Footer from '../comps/sharedComps/Footer';

const DigRepo = () => {
    const [showThings, setShowThings] = useState<boolean>(true); // default to true
    const [viewDig, setViewDig] = useState<string>("");

    useEffect(() => {
        const storedShowThings = localStorage.getItem("showThing");
        const storedViewDig = localStorage.getItem("viewDig");

        if (storedShowThings !== null) {
            setShowThings(storedShowThings === "true");
        }

        if (storedViewDig !== null) {
            console.log(viewDig)
            setViewDig(storedViewDig);
        }
    }, []);


    useEffect(() => {
        if(localStorage.getItem("viewDig")){
            localStorage.setItem("showThing", "false");
        }else{
            localStorage.setItem("showThing", "true");

        }

        if (viewDig != "") {
            localStorage.setItem("viewDig", viewDig);
        }
    }, [viewDig, showThings]);

    return (
        <div className="min-h-screen bg-gray-50">
            <DigitalHeritagePlatform />
            <DigitalRepository
                setViewDig={setViewDig}
                setShowThings={setShowThings}
                showThings={showThings}
                viewDig={viewDig}
            />
            {showThings && <WhereToStartSection />}
            <Footer />
        </div>
    )
}

export default DigRepo;
