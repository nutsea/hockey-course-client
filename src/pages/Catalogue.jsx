import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";

import { IoIosArrowUp } from 'react-icons/io'
import { MdPhotoCamera } from 'react-icons/md'
import edit from '../assets/icons/edit.png'

import '../styles/catalogue.scss'
import PriceFilter from "../components/PriceFilter";
import BrandFilter from "../components/BrandFilter";
import GripFilter from "../components/GripFilter";
import BendFilter from "../components/BendFilter";
import RigidityFilter from "../components/RigidityFilter";
import { fetchBends, fetchBrands, fetchGrips, fetchItems, fetchMax, fetchRigidities } from "../http/itemApi";
import { useNavigate } from "react-router-dom";

export const Catalogue = observer(({ type }) => {
    const navigate = useNavigate()
    const { catalogue } = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [itemsLoading, setItemsLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        Promise.all([
            await fetchMax(),
            await fetchBrands(),
            await fetchGrips(),
            await fetchBends(),
            await fetchRigidities(),
        ]).then(async ([maxData, brandsData, gripsData, bendsData, rigiditiesData]) => {
            catalogue.setMax(maxData)
            catalogue.setBrands(brandsData)
            catalogue.setGrips(gripsData)
            catalogue.setBends(bendsData)
            catalogue.setRigidities(rigiditiesData)

            await fetchItems(catalogue.brands, catalogue.grips, catalogue.bends, catalogue.rigidities, type, catalogue.min, catalogue.max, catalogue.limit, catalogue.page).then((data) => {
                catalogue.setItems(data)
                setLoading(false)
            })
        })
    }

    const fetchFilteredData = () => {
        setItemsLoading(true)
        console.log(catalogue.brandsSet)
        fetchItems(
            catalogue.brandsSet.length > 0 ? catalogue.brandsSet : catalogue.brands,
            catalogue.gripsSet.length > 0 ? catalogue.gripsSet : catalogue.grips,
            catalogue.bendsSet.length > 0 ? catalogue.bendsSet : catalogue.bends,
            catalogue.rigiditiesSet.length > 0 ? catalogue.rigiditiesSet : catalogue.rigidities,
            type,
            catalogue.minSet,
            catalogue.maxSet,
            catalogue.limit,
            catalogue.page
        ).then((data) => {
            catalogue.setItems(data)
            setItemsLoading(false)
        })
    }

    const setPrice = () => {
        document.querySelector('.PriceFilter').classList.toggle('Invisible')
        document.querySelector('.PriceArr').classList.toggle('Down')
    }

    const setBrand = () => {
        document.querySelector('.BrandFilter').classList.toggle('Invisible')
        document.querySelector('.BrandArr').classList.toggle('Down')
    }

    const setGrip = () => {
        document.querySelector('.GripFilter').classList.toggle('Invisible')
        document.querySelector('.GripArr').classList.toggle('Down')
    }

    const setBend = () => {
        document.querySelector('.BendFilter').classList.toggle('Invisible')
        document.querySelector('.BendArr').classList.toggle('Down')
    }

    const setRigidity = () => {
        document.querySelector('.RigidityFilter').classList.toggle('Invisible')
        document.querySelector('.RigidityArr').classList.toggle('Down')
    }

    const showFilter = () => {
        document.querySelector('.FiltersMobile').classList.toggle('FiltersNone')
        document.querySelector('.FilterArr').classList.toggle('Down')
    }

    useEffect(() => {
        try {
            fetchData()
        } catch (e) {

        }
        // eslint-disable-next-line
    }, [type])

    const handleNavigate = (item) => {
        // navigate(`/item/${e.target.id}`)
        const links = document.getElementsByClassName('HType')
        for (let i of links) {
            i.classList.remove('Lined')
        }
        navigate(`/item/${item.id}/${item.code}`)
    }

    return (
        <div className="Catalogue">
            {!loading ?
                <>
                    <div className="FiltersBox ShowFilter" onClick={showFilter}>
                        <img src={edit} alt="Фильтры" />
                        <span>ФИЛЬТРЫ</span>
                        <IoIosArrowUp className="FilterArr Down" />
                    </div>
                    <div className="FilterLine ShowFilter"></div>
                    <div className="FiltersBox FiltersMobile FiltersNone">
                        <div className="Filter">
                            <div className="FSub">КЛЮШКИ</div>
                            <div className="FilterBox">
                                <div className="FBSub" onClick={setPrice}>ФИЛЬТР ПО ЦЕНЕ <IoIosArrowUp className="Arrow PriceArr Down" /></div>
                                <PriceFilter min={0} max={catalogue.max} />
                            </div>
                            <div className="FilterBox">
                                <div className="FBSub" onClick={setBrand}>ФИРМА <IoIosArrowUp className="Arrow BrandArr Down" /></div>
                                <BrandFilter className="brandFilter" />
                            </div>
                            <div className="FilterBox">
                                <div className="FBSub" onClick={setGrip}>ХВАТ <IoIosArrowUp className="Arrow GripArr Down" /></div>
                                <GripFilter className="gripFilter" />
                            </div>
                            <div className="FilterBox">
                                <div className="FBSub" onClick={setBend}>ЗАГИБ <IoIosArrowUp className="Arrow BendArr Down" /></div>
                                <BendFilter className="bendFilter" />
                            </div>
                            <div className="FilterBox LastBox">
                                <div className="FBSub" onClick={setRigidity}>ЖЕСТКОСТЬ <IoIosArrowUp className="Arrow RigidityArr Down" /></div>
                                <RigidityFilter className="rigidityFilter" />
                            </div>
                        </div>
                        <div className="FilterFetch" onClick={fetchFilteredData}>ПОКАЗАТЬ</div>
                        <div className="FilterBreak" onClick={fetchData}>СБРОСИТЬ</div>
                    </div>
                    {type !== 'restored' ?
                        <div className="ItemsBox">
                            {!itemsLoading ?
                                <>
                                    {catalogue.items.length > 0 ?
                                        <div className="ItemsBoxShow">
                                            {/* {[...new Set(catalogue.items.map(item => item.code))].map(uniqueCode => {
                                                const uniqueItem = catalogue.items.find(item => item.code === uniqueCode);

                                                return (
                                                    <div key={uniqueItem.id} className="ItemCard ItemCardMain">
                                                        {uniqueItem.img ?
                                                            <div className="ItemImg">
                                                                <img src={`${process.env.REACT_APP_API_URL + uniqueItem.img}`} alt="Фото клюшки" onClick={() => handleNavigate(uniqueItem)} />
                                                                <div className="ItemClick" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>
                                                                    <div className="ItemShow" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>ПРОСМОТР</div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="ItemImg NoneImg" onClick={() => handleNavigate(uniqueItem)}>
                                                                <div><MdPhotoCamera size={100} /></div>
                                                                <div className="ItemClick" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>
                                                                    <div className="ItemShow" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>ПРОСМОТР</div>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="ItemInfo">
                                                            <div className="ItemBrand">{uniqueItem.brand}</div>
                                                            <div className="ItemName">{uniqueItem.name}</div>
                                                            <div className="ItemPrice">{uniqueItem.price} Р</div>
                                                        </div>
                                                    </div>
                                                );
                                            })} */}
                                            {catalogue.items.map(uniqueItem => {
                                                return (
                                                    <div key={uniqueItem.id} className="ItemCard ItemCardMain">
                                                        {uniqueItem.img ?
                                                            <div className="ItemImg">
                                                                <img src={`${process.env.REACT_APP_API_URL + uniqueItem.img}`} alt="Фото клюшки" onClick={() => handleNavigate(uniqueItem)} />
                                                                <div className="ItemClick" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>
                                                                    <div className="ItemShow" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>ПРОСМОТР</div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="ItemImg NoneImg" onClick={() => handleNavigate(uniqueItem)}>
                                                                <div><MdPhotoCamera size={100} /></div>
                                                                <div className="ItemClick" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>
                                                                    <div className="ItemShow" id={uniqueItem.id} onClick={() => handleNavigate(uniqueItem)}>ПРОСМОТР</div>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="ItemInfo">
                                                            <div className="ItemBrand">{uniqueItem.brand}</div>
                                                            <div className="ItemName">{uniqueItem.name}</div>
                                                            <div className="ItemPrice">{uniqueItem.price} Р</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        :
                                        <div className="NothingFound">Ничего не найдено</div>
                                    }
                                </>
                                :
                                <div className="LoaderContainer">
                                    <div className="Loader"></div>
                                </div>
                            }
                        </div>
                        :
                        <div className="RestoredItemsBox">
                            {!itemsLoading ?
                                <>
                                    {catalogue.items.length > 0 ?
                                        <>
                                            <div className="TableClue">Листать вправо →</div>
                                            <div className="TableWrap2">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <th>Фирма</th>
                                                            <th>Название</th>
                                                            <th>Хват</th>
                                                            <th>Загиб</th>
                                                            <th>Жесткость</th>
                                                            <th>Ремонт</th>
                                                            <th>Цена</th>
                                                            <th>Купить</th>
                                                        </tr>
                                                        {catalogue.items.map((item) => {
                                                            return (
                                                                <tr key={item.id}>
                                                                    <td>{item.brand}</td>
                                                                    <td className="ItemName">
                                                                        <span>{item.name}</span>
                                                                        <span className="Code">Арт. {item.code}</span>
                                                                    </td>
                                                                    <td>{item.grip}</td>
                                                                    <td>{item.bend}</td>
                                                                    <td>{item.rigidity}</td>
                                                                    <td>{item.restore}</td>
                                                                    <td className="ItemPrice">{item.price} Р</td>
                                                                    <td className="ItemBuy"><div>Купить</div></td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                        :
                                        <div className="NothingFound">Ничего не найдено</div>
                                    }
                                </>
                                :
                                <div className="LoaderContainer">
                                    <div className="Loader"></div>
                                </div>
                            }
                        </div>
                    }
                </>
                :
                <div className="LoaderContainer">
                    <div className="Loader"></div>
                </div>
            }
        </div>
    );
})

export default Catalogue;