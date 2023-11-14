import AppRoutes from "./AppRoutes";
import './styles/app.scss'
import './styles/base.scss'

import logo from './assets/images/Logo.png'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const currentUrl = location.pathname
    const [type, setType] = useState('original')

    const chooseType = (e) => {
        setType(e.target.id)
        const links = document.getElementsByClassName('HType')
        for (let i of links) {
            i.classList.remove('Lined')
        }
        e.target.classList.add('Lined')
        navigate('/')
    }

    useEffect(() => {
        console.log(currentUrl)
        if (currentUrl === '/admin/' || currentUrl === '/admin') {
            setType('')
            const links = document.getElementsByClassName('HType')
            for (let i of links) {
                i.classList.remove('Lined')
            }
        } else {
            if (!currentUrl.includes('item'))
            document.getElementById(`${type}`).classList.add('Lined')
        }
    })

    const isAdmin = () => {
        return currentUrl === '/admin/' || currentUrl === '/admin'
    }

    return (
        <div className="App">
            <header className="Header">
                <div className="HeaderTop">
                    <img src={logo} alt="Логотип" />
                </div>
                {!isAdmin() ?
                    <div className="HeaderBottom">
                        <div className="HeaderTypes">
                            <div className="HType Lined" id="original" onClick={chooseType}>ОРИГИНАЛ</div>
                            <div className="HType" id="replica" onClick={chooseType}>РЕПЛИКА</div>
                            <div className="HType" id="restored" onClick={chooseType} >ВОССТАНОВЛЕННЫЕ / БУ</div>
                        </div>
                    </div>
                    :
                    <></>
                }
            </header>
            <AppRoutes type={type} />
        </div>
    );
}

export default App;