import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { findImages, findItem, findSameItems, getCount } from "../http/itemApi";

import '../styles/item.scss'

import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { IoIosArrowUp } from 'react-icons/io'

import sizes1 from '../assets/images/Sizes1.jpeg'
import sizes2 from '../assets/images/Sizes2.png'
import sizes3 from '../assets/images/Sizes3.jpeg'

const Item = () => {
    const { id, code } = useParams()
    const [loading, setLoading] = useState(true)
    const [item, setItem] = useState()
    // eslint-disable-next-line
    const [same, setSame] = useState()
    const [images, setImages] = useState()
    const [grips, setGrips] = useState()
    const [bends, setBends] = useState()
    const [rigidities, setRigidities] = useState()
    const [count, setCount] = useState(1)
    const [dbCount, setDbCount] = useState(null)
    const [countColor, setCountColor] = useState('gray')
    const [chooseGrip, setChooseGrip] = useState(null)
    const [chooseBend, setChooseBend] = useState(null)
    const [chooseRigidity, setChooseRigidity] = useState(null)
    const [tab, setTab] = useState('description')
    const [visible, setVisible] = useState(0)

    const sortAscending = (arr) => {
        return arr.slice().sort((a, b) => a - b)
    }

    useEffect(() => {
        Promise.all([
            findItem(id),
            findSameItems(code),
            findImages(id)
        ]).then(([itemData, sameData, imagesData]) => {
            setItem(itemData)
            setSame(sameData)
            setImages(imagesData)
            setGrips([...new Set(sameData.map(item => item.grip))])
            setBends(sortAscending([...new Set(sameData.map(item => item.bend))]))
            setRigidities(sortAscending([...new Set(sameData.map(item => item.rigidity))]))
            setLoading(false)
        })
        // eslint-disable-next-line
    }, [id])

    const countPlus = () => {
        setCount(count + 1)
    }

    const countMinus = () => {
        count > 1 && setCount(count - 1)
    }

    const gripClick = (e, grip) => {
        const all = document.getElementsByClassName('GripParam')
        for (let i of all) {
            i.classList.remove('Selected')
        }
        e.target.classList.add('Selected')
        setChooseGrip(grip)
        itemCount(grip, chooseBend, chooseRigidity)
    }

    const bendClick = (e, bend) => {
        const all = document.getElementsByClassName('BendParam')
        for (let i of all) {
            i.classList.remove('Selected')
        }
        e.target.classList.add('Selected')
        setChooseBend(bend)
        itemCount(chooseGrip, bend, chooseRigidity)
    }

    const rigidityClick = (e, rigidity) => {
        const all = document.getElementsByClassName('RigidityParam')
        for (let i of all) {
            i.classList.remove('Selected')
        }
        e.target.classList.add('Selected')
        setChooseRigidity(rigidity)
        itemCount(chooseGrip, chooseBend, rigidity)
    }

    const itemCount = (grip, bend, rigidity) => {
        if (grip && bend && rigidity) {
            setDbCount(null)
            getCount(item.code, grip, bend, rigidity).then((data) => {
                setDbCount(data)
                if (Number(data) === 0) {
                    setCountColor('gray')
                }
                if (Number(data) >= 1 && Number(data) <= 5) {
                    setCountColor('gray')
                }
                if (Number(data) >= 6 && Number(data) <= 10) {
                    setCountColor('blue')
                }
                if (Number(data) >= 11 && Number(data) <= 20) {
                    setCountColor('yellow')
                }
                if (Number(data) > 20) {
                    setCountColor('green')
                }
            })
        }
    }

    const dotClick = (e, i) => {
        const all = document.getElementsByClassName('SliderImage')
        for (let k of all) {
            k.classList.remove('Visible')
        }
        const clicked = document.querySelector(`.Img${i}`)
        clicked.classList.add('Visible')
        const btns = document.getElementsByClassName('ImgDot')
        for (let k of btns) {
            k.classList.remove('Active')
        }
        e.target.classList.add('Active')
        setVisible(i)
    }

    const tabClick = (e) => {
        const all = document.getElementsByClassName('InfoTab')
        for (let i of all) {
            i.classList.remove('InfoSelect')
        }
        e.target.classList.add('InfoSelect')
        setTab(e.target.id)
    }

    const formattedCount = (number) => {
        if (Number(number) === 0) {
            return 'Нет в наличии'
        }
        if (Number(number) >= 1 && Number(number) <= 5) {
            return 'Мало'
        }
        if (Number(number) >= 6 && Number(number) <= 10) {
            return 'Хватает'
        }
        if (Number(number) >= 11 && Number(number) <= 20) {
            return 'Достаточно'
        }
        if (Number(number) > 20) {
            return 'Много'
        }
    }

    const slideLeft = () => {
        document.querySelector(`.Img${visible}`).classList.remove('Visible')
        document.querySelector(`.Dot${visible}`).classList.remove('Active')
        const amount = document.getElementsByClassName('SliderImage').length
        if (visible > 0) {
            document.querySelector(`.Img${visible - 1}`).classList.add('Visible')
            document.querySelector(`.Dot${visible - 1}`).classList.add('Active')
            setVisible(visible - 1)
        }
        if (visible === 0) {
            document.querySelector(`.Img${amount - 1}`).classList.add('Visible')
            document.querySelector(`.Dot${amount - 1}`).classList.add('Active')
            setVisible(amount - 1)
        }
    }

    const slideRight = () => {
        document.querySelector(`.Img${visible}`).classList.remove('Visible')
        document.querySelector(`.Dot${visible}`).classList.remove('Active')
        const amount = document.getElementsByClassName('SliderImage').length
        if (visible < amount - 1) {
            document.querySelector(`.Img${visible + 1}`).classList.add('Visible')
            document.querySelector(`.Dot${visible + 1}`).classList.add('Active')
            setVisible(visible + 1)
        }
        if (visible === amount - 1) {
            document.querySelector(`.Img${0}`).classList.add('Visible')
            document.querySelector(`.Dot${0}`).classList.add('Active')
            setVisible(0)
        }
    }

    return (
        <div className="ItemContainer">
            {!loading ?
                <>
                    {item ?
                        <>
                            <div className="ItemCard ItemCardOne">
                                <div className="ItemSlider">
                                    <div className="ImageContainer">
                                        <div className="SliderBtn SlideLeft" onClick={slideLeft}><IoIosArrowUp className="SlLeft" size={30} /></div>
                                        {images.map((image, i) => {
                                            return (
                                                <>
                                                    <div key={i} className={`SliderImage Img${i} ${i === 0 ? 'Visible' : ''}`}>
                                                        <img src={`${process.env.REACT_APP_API_URL + image.img}`} alt="Фото клюшки" />
                                                    </div>
                                                </>
                                            )
                                        })}
                                        <div className="SliderBtn SlideRight" onClick={slideRight}><IoIosArrowUp className="SlRight" size={30} /></div>
                                    </div>
                                    <div className="SliderDots">
                                        {images.map((image, i) => {
                                            return (
                                                <div key={i} className={`ImgDot Dot${i} ${i === 0 ? 'Active' : ''}`} onClick={(e) => dotClick(e, i)}></div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="ItemParams">
                                    <div className="ItemBrand">{item.brand}</div>
                                    <div className="ItemName">{item.name}</div>
                                    <div className="ItemCode">Арт. {item.code}</div>
                                    <div className="ItemCountContainer">
                                        {dbCount || dbCount === 0 ?
                                            <div className={`ItemCount ${countColor}`}>{formattedCount(dbCount)}</div>
                                            :
                                            <></>
                                        }
                                    </div>
                                    <div className="ItemPrice">{item.price} Р</div>
                                    <div className="ParamSub">Хват</div>
                                    <div className="ParamsBtns">
                                        {grips.map((grip, i) => {
                                            return (
                                                <div key={i} className="Param GripParam" onClick={(e) => gripClick(e, grip)}>{grip}</div>
                                            )
                                        })}
                                    </div>
                                    <div className="ParamSub">Загиб</div>
                                    <div className="ParamsBtns">
                                        {bends.map((bend, i) => {
                                            return (
                                                <div key={i} className="Param BendParam" onClick={(e) => bendClick(e, bend)}>{bend}</div>
                                            )
                                        })}
                                    </div>
                                    <div className="ParamSub">Жесткость</div>
                                    <div className="ParamsBtns">
                                        {rigidities.map((rigidity, i) => {
                                            return (
                                                <div key={i} className="Param RigidityParam" onClick={(e) => rigidityClick(e, rigidity)}>{rigidity}</div>
                                            )
                                        })}
                                    </div>
                                    <div className="ParamSub">Количество</div>
                                    <div className="ItemCount">
                                        <div className="CountBtn" onClick={countMinus}><AiOutlineMinus /></div>
                                        <div className="CountDigit">{count}</div>
                                        <div className="CountBtn" onClick={countPlus}><AiOutlinePlus /></div>
                                    </div>
                                    <div className="ItemBuy">КУПИТЬ</div>
                                </div>
                            </div>
                            <div className="ItemInfo">
                                <div className="InfoHeader">
                                    <div className="InfoTab InfoSelect" id="description" onClick={tabClick}>ОПИСАНИЕ</div>
                                    <div className="InfoTab" id="sizes" onClick={tabClick}>ТАБЛИЦА РАЗМЕРОВ</div>
                                    <div className="InfoTab" id="delivery" onClick={tabClick}>ДОСТАВКА</div>
                                </div>
                                <div className="InfoContent">
                                    {tab === 'description' ?
                                        <>
                                            <div className="InfoDesc">
                                                <div className="IDText">
                                                    <div className="InfoSub">{item.name}</div>
                                                    <div className="InfoText">
                                                        {item.description.split('\n').map((text, i) => {
                                                            return (
                                                                <span key={i}>{text}</span>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                {item.img &&
                                                    <div className="IDImg">
                                                        <img src={`${process.env.REACT_APP_API_URL + item.img}`} alt="Фото клюшки" />
                                                    </div>
                                                }
                                            </div>
                                        </>
                                        :
                                        (tab === 'sizes') ?
                                            <>
                                                <div className="SizesImg">
                                                    <img src={sizes1} alt="Таблица размеров" />
                                                </div>
                                                <div className="SizesImg">
                                                    <img src={sizes2} alt="Таблица размеров" />
                                                </div>
                                                <div className="SizesImg">
                                                    <img src={sizes3} alt="Таблица размеров" />
                                                </div>
                                            </>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <div className="ItemNotFound">Товар не найден</div>
                    }
                </>
                :
                <div className="LoaderContainer">
                    <div className="Loader"></div>
                </div>
            }
        </div>
    );
}

export default Item;