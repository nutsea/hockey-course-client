import React, { useEffect, useState } from "react";

import { IoMdTrash } from 'react-icons/io'
import { BiImageAdd } from 'react-icons/bi'
import { AiOutlineFileImage } from 'react-icons/ai'

import '../styles/admin.scss'
import { addOld, createNew, deleteItems, fetchOriginals, fetchReplicas, fetchRestored, findImages, updateItem, updateItemAndImages } from "../http/itemApi";

const Admin = () => {
    const [isChecked, setIsChecked] = useState(false)
    const [chosen, setChosen] = useState('original')
    const [originals, setOriginals] = useState(null)
    const [replicas, setReplicas] = useState(null)
    const [restored, setRestored] = useState(null)
    const [createOriginal, setCreateOriginal] = useState(false)
    const [createReplica, setCreateReplica] = useState(false)
    const [createRestored, setCreateRestored] = useState(false)
    const [toDelete, setToDelete] = useState(null)
    const [canDelete, setCanDelete] = useState(false)
    const [data, setData] = useState({
        code: '',
        brand: '',
        name: '',
        description: '',
        price: '',
        grip: '',
        bend: '',
        rigidity: '',
        count: '',
        restore: '',
        file: null,
        files: null
    })
    const [changeItem, setChangeItem] = useState(null)
    const [changeImages, setChangeImages] = useState(null)
    const [deleteImages, setDeleteImages] = useState([])
    const [newImages, setNewImages] = useState({
        file: null,
        files: null
    })

    const check = (e) => {
        e.preventDefault()
        const value = document.querySelector('.CheckInput').value
        if (value === process.env.REACT_APP_ADMIN) {
            setIsChecked(true)
        } else {
            document.querySelector('.CheckInput').value = ''
            document.querySelector('.CheckWrong').classList.add('Error')
        }
    }

    const chooseTab = (e) => {
        setChosen(e.target.id)
        const tabs = document.getElementsByClassName('PanelTab')
        for (let i of tabs) {
            i.classList.remove('Chosen')
        }
        e.target.classList.add('Chosen')
        if (e.target.id === 'original') {
            fetchOriginals().then(data => {
                setOriginals(data)
            })
        }
        if (e.target.id === 'replica') {
            fetchReplicas().then(data => {
                setReplicas(data)
            })
        }
        if (e.target.id === 'restored') {
            fetchRestored().then(data => {
                setRestored(data)
            })
        }
        cancelCreate()
        setToDelete(null)
        setCanDelete(false)
        setChangeItem(null)
    }

    const checkboxClick = (e, id) => {
        if (!e.target.classList.contains(`Check${id}`)) {
            const checkbox = document.querySelector(`.Check${id}`)
            checkbox.checked ? checkbox.checked = false : checkbox.checked = true
        }
    }

    const checkboxThrow = () => {
        const checkboxes = document.getElementsByClassName('Checkbox')
        for (let i of checkboxes) {
            i.checked = false
        }
        setToDelete(null)
    }

    const deleteMany = () => {
        const checkboxes = document.getElementsByClassName('Checkbox')
        let idArr = []
        for (let i of checkboxes) {
            if (i.checked === true) idArr.push(i.id)
        }
        if (idArr.length > 0) {
            setToDelete(idArr)
            setCanDelete(true)
        }
    }

    const deleteConfirm = () => {
        if (toDelete.length > 0) {
            switch (chosen) {
                case 'original':
                    setOriginals(null)
                    deleteItems(toDelete).then(() => {
                        setCanDelete(false)
                        fetchOriginals().then(data => {
                            setOriginals(data)
                        })
                    })
                    break

                case 'replica':
                    setReplicas(null)
                    deleteItems(toDelete).then(() => {
                        setCanDelete(false)
                        fetchReplicas().then(data => {
                            setReplicas(data)
                        })
                    })
                    break

                case 'restored':
                    setRestored(null)
                    deleteItems(toDelete).then(() => {
                        setCanDelete(false)
                        fetchRestored().then(data => {
                            setRestored(data)
                        })
                    })
                    break

                default:
                    break
            }
        }
    }

    const cancelDelete = () => {
        setCanDelete(false)
    }

    const setFiles = (e) => {
        const unset = document.querySelector(`.${e.target.id}Unset`)
        const set = document.querySelector(`.${e.target.id}Set`)
        const clear = document.querySelector(`.${e.target.id}Clear`)

        if (e.target.files.length === 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = e.target.files[0].name
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
        }

        if (e.target.files.length > 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = 'Выбрано файлов: ' + e.target.files.length
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
        }
    }

    const clearFiles = (e) => {
        document.querySelector(`.${e.target.id}Input`).value = null
        document.querySelector(`.${e.target.id}Unset`).classList.add('Showed')
        document.querySelector(`.${e.target.id}Set`).classList.remove('Showed')
        document.querySelector(`.${e.target.id}Clear`).classList.remove('Showed')
        setData((prevFormData) => ({
            ...prevFormData,
            [e.target.classList[0]]: null,
        }))
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target

        let newValue = value

        let images = []

        if (name === 'price' || name === 'bend' || name === 'rigidity' || name === 'count') {
            newValue = ('' + newValue).replace(/\D/g, '')
        }

        if (name === 'file') {
            images = files[0]
        }

        if (name === 'files') {
            images = files
        }

        setData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'file' ? images : newValue,
        }))
    }

    const cancelCreate = () => {
        setData({
            code: '',
            brand: '',
            name: '',
            description: '',
            price: '',
            grip: '',
            bend: '',
            rigidity: '',
            count: '',
            restore: '',
            file: null,
            files: null
        })
        setCreateOriginal(false)
        setCreateReplica(false)
        setCreateRestored(false)
    }

    const createNewItem = () => {
        if (data.code && data.brand && data.name && data.description && data.price && data.grip && data.bend && data.rigidity && chosen && data.count && data.file && data.files) {
            createNew(data.code, data.brand, data.name, data.description, data.price, data.grip, data.bend, data.rigidity, chosen, data.count, data.restore, data.file, data.files)
                .then(() => {
                    if (chosen === 'original') {
                        setOriginals(null)
                        fetchOriginals().then(data => {
                            setOriginals(data)
                        })
                    }
                    if (chosen === 'replica') {
                        setReplicas(null)
                        fetchReplicas().then(data => {
                            setReplicas(data)
                        })
                    }
                    if (chosen === 'restored') {
                        setRestored(null)
                        fetchRestored().then(data => {
                            setRestored(data)
                        })
                    }
                    cancelCreate()
                })
        } else {
            switch (chosen) {
                case 'original':
                    document.querySelector('.origWarning').classList.add('Error')
                    break

                case 'replica':
                    document.querySelector('.repWarning').classList.add('Error')
                    break

                default:
                    break
            }
        }
    }

    const createOldItem = () => {
        if (data.code && data.brand && data.name && data.description && data.price && data.grip && data.bend && data.rigidity && chosen && data.restore) {
            addOld(data.code, data.brand, data.name, data.description, data.price, data.grip, data.bend, data.rigidity, chosen, data.restore)
                .then(() => {
                    if (chosen === 'original') {
                        setOriginals(null)
                        fetchOriginals().then(data => {
                            setOriginals(data)
                        })
                    }
                    if (chosen === 'replica') {
                        setReplicas(null)
                        fetchReplicas().then(data => {
                            setReplicas(data)
                        })
                    }
                    if (chosen === 'restored') {
                        setRestored(null)
                        fetchRestored().then(data => {
                            setRestored(data)
                        })
                    }
                    cancelCreate()
                })
        } else {
            document.querySelector('.restWarning').classList.add('Error')
        }
    }

    const changeItemClick = (item) => {
        findImages(item.id)
            .then((data) => {
                setChangeItem(item)
                setChangeImages(data)
            })
            .finally(() => {
                setChangeItem(item)
            })
    }

    const deleteImgClick = (id) => {
        const img = document.querySelector(`.Img${id}`)
        img.classList.toggle('ChooseImg')
        if (img.classList.contains('ChooseImg')) {
            setDeleteImages((prevDeleteImages) => [...prevDeleteImages, id])
        } else {
            setDeleteImages((prevDeleteImages) => prevDeleteImages.filter((imageId) => imageId !== id))
        }
    }

    const changeConfirm = () => {
        updateItemAndImages(changeItem.id, changeItem.code, changeItem.brand, changeItem.name, changeItem.description, changeItem.price, changeItem.grip, changeItem.bend, changeItem.rigidity, changeItem.count, changeItem.restore, newImages.file, newImages.files, deleteImages)
            .then(() => {
                if (chosen === 'original') {
                    setOriginals(null)
                    fetchOriginals().then(data => {
                        setOriginals(data)
                    })
                }
                if (chosen === 'replica') {
                    setReplicas(null)
                    fetchReplicas().then(data => {
                        setReplicas(data)
                    })
                }
                if (chosen === 'restored') {
                    setRestored(null)
                    fetchRestored().then(data => {
                        setRestored(data)
                    })
                }
                setChangeItem(null)
                setDeleteImages([])
                setNewImages({
                    file: null,
                    files: null
                })
            })
    }

    const handleChangeItem = (e) => {
        const { name, value, type, files } = e.target

        let newValue = value

        let images = []

        if (name === 'price' || name === 'bend' || name === 'rigidity' || name === 'count') {
            newValue = ('' + newValue).replace(/\D/g, '')
        }

        if (name === 'file') {
            images = files[0]
        }

        if (name === 'files') {
            images = files
        }

        if (name !== 'file' && name !== 'files') {
            setChangeItem((prevFormData) => ({
                ...prevFormData,
                [name]: type === 'file' ? images : newValue,
            }))
        } else {
            setNewImages((prevFormData) => ({
                ...prevFormData,
                [name]: images
            }))
        }
    }

    const cancelChange = () => {
        setChangeItem(null)
        setDeleteImages([])
        setNewImages({
            file: null,
            files: null
        })
    }

    useEffect(() => {
        fetchOriginals().then(data => {
            setOriginals(data)
        })
    }, [])

    return (
        <div className="AdminContainer">
            <div className="AdminSub">Панель администратора</div>
            {!isChecked ?
                <div className="AdminCheck">
                    <form onSubmit={check}>
                        <input className="CheckInput" type="password" placeholder="Код доступа" />
                    </form>
                    <div className="CheckNext" onClick={check}>Продолжить</div>
                    <div className="CheckWrong">Неверный код</div>
                </div>
                :
                <>
                    <div className="Panel">
                        <div className="PanelHead">
                            <div className="PanelTab Chosen" id="original" onClick={chooseTab}>ОРИГИНАЛ</div>
                            <div className="PanelTab" id="replica" onClick={chooseTab}>РЕПЛИКА</div>
                            <div className="PanelTab" id="restored" onClick={chooseTab}>ВОССТАНОВЛЕННЫЕ / БУ</div>
                        </div>
                        <div className="Workspace">
                            {chosen === 'original' ?
                                <>
                                    <div className="CreateBtn" onClick={() => setCreateOriginal(true)}>Создать товар</div>
                                    {!createOriginal ?
                                        <>
                                            {originals ?
                                                <>
                                                    {!changeItem ?
                                                        <>
                                                            {originals.length > 0 ?
                                                                <>
                                                                    {!canDelete ?
                                                                        <div className="DeleteContainer">
                                                                            <div className="DeleteBtn" onClick={deleteMany}>Удалить выбранное</div>
                                                                            <div className="ThrowCheck" onClick={checkboxThrow}>Сбросить выбор</div>
                                                                        </div>
                                                                        :
                                                                        <div className="DeleteConfirm">
                                                                            <div className="ConfirmText">Вы уверены, что хотите удалить выбранные товары?</div>
                                                                            <div className="ConfirmBtns">
                                                                                <div className="DeleteBtn" onClick={deleteConfirm}>Удалить</div>
                                                                                <div className="DeleteCancel" onClick={cancelDelete}>Отменить</div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    <div className="Clue">Для редактирования нажмите на нужный товар</div>
                                                                    <div className="TableClue Light">Листать вправо →</div>
                                                                    <div className="TableWrap">
                                                                        <table>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th></th>
                                                                                    <th>Артикул</th>
                                                                                    <th>Фирма</th>
                                                                                    <th>Название</th>
                                                                                    <th>Хват</th>
                                                                                    <th>Загиб</th>
                                                                                    <th>Жесткость</th>
                                                                                    <th>Цена</th>
                                                                                    <th>Кол-во</th>
                                                                                </tr>
                                                                                {originals.map((item, i) => {
                                                                                    return (
                                                                                        <tr key={item.id} className="ItemRow">
                                                                                            <td onClick={(e) => checkboxClick(e, item.id)}>
                                                                                                <input type="checkbox" className={`Checkbox Check${item.id}`} id={item.id} />
                                                                                            </td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.code}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.brand}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.name}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.grip}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.bend}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.rigidity}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.price}</td>
                                                                                            <td onClick={() => changeItemClick(item)}>{item.count}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </>
                                                                :
                                                                <div className="NoItems">Товаров нет</div>
                                                            }
                                                        </>
                                                        :
                                                        <div className="CreateContainer">
                                                            <div className="CreateSub">Редактирование товара</div>
                                                            <div className="InputClue">Артикул</div>
                                                            <input type="text" placeholder="Артикул" name="code" maxLength={250} value={changeItem.code} onChange={handleChangeItem} />
                                                            <div className="InputClue">Фирма</div>
                                                            <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={changeItem.brand} onChange={handleChangeItem} />
                                                            <div className="InputClue">Название</div>
                                                            <input type="text" placeholder="Название" name="name" maxLength={250} value={changeItem.name} onChange={handleChangeItem} />
                                                            <div className="InputClue">Описание</div>
                                                            <textarea placeholder="Описание" name="description" value={changeItem.description} onChange={handleChangeItem}></textarea>
                                                            <div className="InputClue">Цена</div>
                                                            <input type="text" placeholder="Цена" name="price" maxLength={9} value={changeItem.price} onChange={handleChangeItem} />
                                                            <div className="InputClue">Хват</div>
                                                            <input type="text" placeholder="Хват" name="grip" maxLength={250} value={changeItem.grip} onChange={handleChangeItem} />
                                                            <div className="InputClue">Загиб</div>
                                                            <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={changeItem.bend} onChange={handleChangeItem} />
                                                            <div className="InputClue">Жесткость</div>
                                                            <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={changeItem.rigidity} onChange={handleChangeItem} />
                                                            <div className="InputClue">Количество</div>
                                                            <input type="text" placeholder="Количество" name="count" maxLength={9} value={changeItem.count} onChange={handleChangeItem} />
                                                            <div className="PhotoChange">
                                                                <div className="InputClue">Старая обложка (чтобы удалить, загрузите фото в поле "Новая обложка")</div>
                                                                <div className="ChangeImgContainer">
                                                                    <img src={`${process.env.REACT_APP_API_URL + changeItem.img}`} alt="" />
                                                                </div>
                                                            </div>
                                                            {changeImages.length > 0 &&
                                                                <div className="PhotoChange PhChange2">
                                                                    <div className="InputClue">Старые фотографии карточки (нажмите на фото, чтобы удалить)</div>
                                                                    <div className="ChangeImgContainer ArrayImg">
                                                                        {changeImages.map((img, i) => {
                                                                            return (
                                                                                <div key={i} className={`ImgChange Img${img.id}`}>
                                                                                    <div className="ImgChangeDelete" onClick={() => deleteImgClick(img.id)}><IoMdTrash size={70} /></div>
                                                                                    <img src={`${process.env.REACT_APP_API_URL + img.img}`} alt="" />
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            }
                                                            <div className="InputClue">Новая обложка</div>
                                                            <div className="FileInput origfile">
                                                                <input
                                                                    className="origfileInput"
                                                                    type="file"
                                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                    multiple={false}
                                                                    id="origfile"
                                                                    name="file"
                                                                    onChange={(e) => {
                                                                        setFiles(e)
                                                                        handleChangeItem(e)
                                                                    }}
                                                                />
                                                                <div className="FileInfo origfileUnset Showed">
                                                                    <div className="FileText">
                                                                        <BiImageAdd className="FileImg" size={30} />
                                                                        <div className="FileTextLoad">Обложка товара</div>
                                                                    </div>
                                                                    <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                </div>
                                                                <div className="FileInfo origfileSet">
                                                                    <div className="FileText">
                                                                        <AiOutlineFileImage size={30} />
                                                                        <div className="FileTextLoad origfileName"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="file FileClear origfileClear" id="origfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                                            <div className="InputClue">Новые фотографии карточки</div>
                                                            <div className="FileInput origfiles">
                                                                <input
                                                                    className="origfilesInput"
                                                                    type="file"
                                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                    multiple={true}
                                                                    id="origfiles"
                                                                    name="files"
                                                                    onChange={(e) => {
                                                                        setFiles(e)
                                                                        handleChangeItem(e)
                                                                    }}
                                                                />
                                                                <div className="FileInfo origfilesUnset Showed">
                                                                    <div className="FileText">
                                                                        <BiImageAdd className="FileImg" size={30} />
                                                                        <div className="FileTextLoad">Фотографии карточки</div>
                                                                    </div>
                                                                    <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                </div>
                                                                <div className="FileInfo origfilesSet">
                                                                    <div className="FileText">
                                                                        <AiOutlineFileImage size={30} />
                                                                        <div className="FileTextLoad origfilesName"></div>
                                                                    </div>
                                                                    <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                                </div>
                                                            </div>
                                                            <div className="files FileClear origfilesClear" id="origfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                                            <div className="CreateItemBtn" onClick={changeConfirm}>Сохранить</div>
                                                            <div className="CreateCancelItemBtn" onClick={cancelChange}>Отменить</div>
                                                        </div>
                                                    }
                                                </>
                                                :
                                                <div className="LoaderContainer2">
                                                    <div className="LoaderLight"></div>
                                                </div>
                                            }
                                        </>
                                        :
                                        <div className="CreateContainer">
                                            <div className="CreateSub">Добавление товара</div>
                                            <div className="InputClue">Артикул</div>
                                            <input type="text" placeholder="Артикул" name="code" maxLength={250} value={data.code} onChange={handleChange} />
                                            <div className="InputClue">Фирма</div>
                                            <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={data.brand} onChange={handleChange} />
                                            <div className="InputClue">Название</div>
                                            <input type="text" placeholder="Название" name="name" maxLength={250} value={data.name} onChange={handleChange} />
                                            <div className="InputClue">Описание</div>
                                            <textarea placeholder="Описание" name="description" value={data.description} onChange={handleChange}></textarea>
                                            <div className="InputClue">Цена</div>
                                            <input type="text" placeholder="Цена" name="price" maxLength={9} value={data.price} onChange={handleChange} />
                                            <div className="InputClue">Хват</div>
                                            <input type="text" placeholder="Хват" name="grip" maxLength={250} value={data.grip} onChange={handleChange} />
                                            <div className="InputClue">Загиб</div>
                                            <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={data.bend} onChange={handleChange} />
                                            <div className="InputClue">Жесткость</div>
                                            <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={data.rigidity} onChange={handleChange} />
                                            <div className="InputClue">Количество</div>
                                            <input type="text" placeholder="Количество" name="count" maxLength={9} value={data.count} onChange={handleChange} />
                                            <div className="InputClue">Обложка</div>
                                            <div className="FileInput origfile">
                                                <input
                                                    className="origfileInput"
                                                    type="file"
                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                    multiple={false}
                                                    id="origfile"
                                                    name="file"
                                                    onChange={(e) => {
                                                        setFiles(e)
                                                        handleChange(e)
                                                    }}
                                                />
                                                <div className="FileInfo origfileUnset Showed">
                                                    <div className="FileText">
                                                        <BiImageAdd className="FileImg" size={30} />
                                                        <div className="FileTextLoad">Обложка товара</div>
                                                    </div>
                                                    <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                </div>
                                                <div className="FileInfo origfileSet">
                                                    <div className="FileText">
                                                        <AiOutlineFileImage size={30} />
                                                        <div className="FileTextLoad origfileName"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="file FileClear origfileClear" id="origfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                            <div className="InputClue">Фотографии карточки</div>
                                            <div className="FileInput origfiles">
                                                <input
                                                    className="origfilesInput"
                                                    type="file"
                                                    accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                    multiple={true}
                                                    id="origfiles"
                                                    name="files"
                                                    onChange={(e) => {
                                                        setFiles(e)
                                                        handleChange(e)
                                                    }}
                                                />
                                                <div className="FileInfo origfilesUnset Showed">
                                                    <div className="FileText">
                                                        <BiImageAdd className="FileImg" size={30} />
                                                        <div className="FileTextLoad">Фотографии карточки</div>
                                                    </div>
                                                    <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                    <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                </div>
                                                <div className="FileInfo origfilesSet">
                                                    <div className="FileText">
                                                        <AiOutlineFileImage size={30} />
                                                        <div className="FileTextLoad origfilesName"></div>
                                                    </div>
                                                    <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                </div>
                                            </div>
                                            <div className="files FileClear origfilesClear" id="origfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                            <div className="CreateWarning origWarning">Заполните все поля!</div>
                                            <div className="CreateItemBtn" onClick={createNewItem}>Создать</div>
                                            <div className="CreateCancelItemBtn" onClick={cancelCreate}>Отменить</div>
                                        </div>
                                    }
                                </>
                                :
                                (chosen === 'replica') ?
                                    <>
                                        <div className="CreateBtn" onClick={() => setCreateReplica(true)}>Создать товар</div>
                                        {!createReplica ?
                                            <>
                                                {replicas ?
                                                    <>
                                                        {!changeItem ?
                                                            <>
                                                                {replicas.length > 0 ?
                                                                    <>
                                                                        {!canDelete ?
                                                                            <div className="DeleteContainer">
                                                                                <div className="DeleteBtn" onClick={deleteMany}>Удалить выбранное</div>
                                                                                <div className="ThrowCheck" onClick={checkboxThrow}>Сбросить выбор</div>
                                                                            </div>
                                                                            :
                                                                            <div className="DeleteConfirm">
                                                                                <div className="ConfirmText">Вы уверены, что хотите удалить выбранные товары?</div>
                                                                                <div className="ConfirmBtns">
                                                                                    <div className="DeleteBtn" onClick={deleteConfirm}>Удалить</div>
                                                                                    <div className="DeleteCancel" onClick={cancelDelete}>Отменить</div>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        <div className="Clue">Для редактирования нажмите на нужный товар</div>
                                                                        <div className="TableWrap">
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th></th>
                                                                                        <th>Артикул</th>
                                                                                        <th>Фирма</th>
                                                                                        <th>Название</th>
                                                                                        <th>Хват</th>
                                                                                        <th>Загиб</th>
                                                                                        <th>Жесткость</th>
                                                                                        <th>Цена</th>
                                                                                        <th>Кол-во</th>
                                                                                        {/* <th>Удалить</th> */}
                                                                                    </tr>
                                                                                    {replicas.map((item, i) => {
                                                                                        return (
                                                                                            <tr key={item.id} className="ItemRow">
                                                                                                <td onClick={(e) => checkboxClick(e, item.id)}>
                                                                                                    <input type="checkbox" className={`Checkbox Check${item.id}`} id={item.id} />
                                                                                                </td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.code}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.brand}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.name}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.grip}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.bend}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.rigidity}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.price}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.count}</td>
                                                                                                {/* <td className="DeleteRow"><IoMdTrash size={20} /></td> */}
                                                                                            </tr>
                                                                                        )
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <div className="NoItems">Товаров нет</div>
                                                                }
                                                            </>
                                                            :
                                                            <div className="CreateContainer">
                                                                <div className="CreateSub">Редактирование товара</div>
                                                                <div className="InputClue">Артикул</div>
                                                                <input type="text" placeholder="Артикул" name="code" maxLength={250} value={changeItem.code} onChange={handleChangeItem} />
                                                                <div className="InputClue">Фирма</div>
                                                                <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={changeItem.brand} onChange={handleChangeItem} />
                                                                <div className="InputClue">Название</div>
                                                                <input type="text" placeholder="Название" name="name" maxLength={250} value={changeItem.name} onChange={handleChangeItem} />
                                                                <div className="InputClue">Описание</div>
                                                                <textarea placeholder="Описание" name="description" value={changeItem.description} onChange={handleChangeItem}></textarea>
                                                                <div className="InputClue">Цена</div>
                                                                <input type="text" placeholder="Цена" name="price" maxLength={9} value={changeItem.price} onChange={handleChangeItem} />
                                                                <div className="InputClue">Хват</div>
                                                                <input type="text" placeholder="Хват" name="grip" maxLength={250} value={changeItem.grip} onChange={handleChangeItem} />
                                                                <div className="InputClue">Загиб</div>
                                                                <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={changeItem.bend} onChange={handleChangeItem} />
                                                                <div className="InputClue">Жесткость</div>
                                                                <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={changeItem.rigidity} onChange={handleChangeItem} />
                                                                <div className="InputClue">Количество</div>
                                                                <input type="text" placeholder="Количество" name="count" maxLength={9} value={changeItem.count} onChange={handleChangeItem} />
                                                                <div className="PhotoChange">
                                                                    <div className="InputClue">Старая обложка (чтобы удалить, загрузите фото в поле "Новая обложка")</div>
                                                                    <div className="ChangeImgContainer">
                                                                        <img src={`${process.env.REACT_APP_API_URL + changeItem.img}`} alt="" />
                                                                    </div>
                                                                </div>
                                                                {changeImages.length > 0 &&
                                                                    <div className="PhotoChange PhChange2">
                                                                        <div className="InputClue">Старые фотографии карточки (нажмите на фото, чтобы удалить)</div>
                                                                        <div className="ChangeImgContainer ArrayImg">
                                                                            {changeImages.map((img, i) => {
                                                                                return (
                                                                                    <div key={i} className={`ImgChange Img${img.id}`}>
                                                                                        <div className="ImgChangeDelete" onClick={() => deleteImgClick(img.id)}><IoMdTrash size={70} /></div>
                                                                                        <img src={`${process.env.REACT_APP_API_URL + img.img}`} alt="" />
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                }
                                                                <div className="InputClue">Новая обложка</div>
                                                                <div className="FileInput repfile">
                                                                    <input
                                                                        className="repfileInput"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                        multiple={false}
                                                                        id="repfile"
                                                                        name="file"
                                                                        onChange={(e) => {
                                                                            setFiles(e)
                                                                            handleChangeItem(e)
                                                                        }}
                                                                    />
                                                                    <div className="FileInfo repfileUnset Showed">
                                                                        <div className="FileText">
                                                                            <BiImageAdd className="FileImg" size={30} />
                                                                            <div className="FileTextLoad">Обложка товара</div>
                                                                        </div>
                                                                        <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                                        <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                    </div>
                                                                    <div className="FileInfo repfileSet">
                                                                        <div className="FileText">
                                                                            <AiOutlineFileImage size={30} />
                                                                            <div className="FileTextLoad repfileName"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="file FileClear repfileClear" id="repfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                                                <div className="InputClue">Новые фотографии карточки</div>
                                                                <div className="FileInput repfiles">
                                                                    <input
                                                                        className="repfilesInput"
                                                                        type="file"
                                                                        accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                                        multiple={true}
                                                                        id="repfiles"
                                                                        name="files"
                                                                        onChange={(e) => {
                                                                            setFiles(e)
                                                                            handleChangeItem(e)
                                                                        }}
                                                                    />
                                                                    <div className="FileInfo repfilesUnset Showed">
                                                                        <div className="FileText">
                                                                            <BiImageAdd className="FileImg" size={30} />
                                                                            <div className="FileTextLoad">Фотографии карточки</div>
                                                                        </div>
                                                                        <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                                        <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                                    </div>
                                                                    <div className="FileInfo repfilesSet">
                                                                        <div className="FileText">
                                                                            <AiOutlineFileImage size={30} />
                                                                            <div className="FileTextLoad repfilesName"></div>
                                                                        </div>
                                                                        <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                                    </div>
                                                                </div>
                                                                <div className="files FileClear repfilesClear" id="repfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                                                <div className="CreateItemBtn" onClick={changeConfirm}>Сохранить</div>
                                                                <div className="CreateCancelItemBtn" onClick={cancelChange}>Отменить</div>
                                                            </div>
                                                        }
                                                    </>
                                                    :
                                                    <div className="LoaderContainer2">
                                                        <div className="LoaderLight"></div>
                                                    </div>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className="CreateContainer">
                                                    <div className="CreateSub">Добавление товара</div>
                                                    <div className="InputClue">Артикул</div>
                                                    <input type="text" placeholder="Артикул" name="code" maxLength={250} value={data.code} onChange={handleChange} />
                                                    <div className="InputClue">Фирма</div>
                                                    <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={data.brand} onChange={handleChange} />
                                                    <div className="InputClue">Название</div>
                                                    <input type="text" placeholder="Название" name="name" maxLength={250} value={data.name} onChange={handleChange} />
                                                    <div className="InputClue">Описание</div>
                                                    <textarea placeholder="Описание" name="description" value={data.description} onChange={handleChange}></textarea>
                                                    <div className="InputClue">Цена</div>
                                                    <input type="text" placeholder="Цена" name="price" maxLength={9} value={data.price} onChange={handleChange} />
                                                    <div className="InputClue">Хват</div>
                                                    <input type="text" placeholder="Хват" name="grip" maxLength={250} value={data.grip} onChange={handleChange} />
                                                    <div className="InputClue">Загиб</div>
                                                    <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={data.bend} onChange={handleChange} />
                                                    <div className="InputClue">Жесткость</div>
                                                    <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={data.rigidity} onChange={handleChange} />
                                                    <div className="InputClue">Количество</div>
                                                    <input type="text" placeholder="Количество" name="count" maxLength={9} value={data.count} onChange={handleChange} />
                                                    <div className="InputClue">Обложка</div>
                                                    <div className="FileInput repfile">
                                                        <input
                                                            className="repfileInput"
                                                            type="file"
                                                            accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                            multiple={false}
                                                            id="repfile"
                                                            name="file"
                                                            onChange={(e) => {
                                                                setFiles(e)
                                                                handleChange(e)
                                                            }}
                                                        />
                                                        <div className="FileInfo repfileUnset Showed">
                                                            <div className="FileText">
                                                                <BiImageAdd className="FileImg" size={30} />
                                                                <div className="FileTextLoad">Обложка товара</div>
                                                            </div>
                                                            <div className="FileClue">Нажмите на поле или перетащите файл</div>
                                                            <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                        </div>
                                                        <div className="FileInfo repfileSet">
                                                            <div className="FileText">
                                                                <AiOutlineFileImage size={30} />
                                                                <div className="FileTextLoad repfileName"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="file FileClear repfileClear" id="repfile" name="file" onClick={clearFiles}>Очистить поле</div>
                                                    <div className="InputClue">Фотографии карточки</div>
                                                    <div className="FileInput repfiles">
                                                        <input
                                                            className="repfilesInput"
                                                            type="file"
                                                            accept=".jpg, .jpeg, .JPG, .JPEG, .png, .PNG"
                                                            multiple={true}
                                                            id="repfiles"
                                                            name="files"
                                                            onChange={(e) => {
                                                                setFiles(e)
                                                                handleChange(e)
                                                            }}
                                                        />
                                                        <div className="FileInfo repfilesUnset Showed">
                                                            <div className="FileText">
                                                                <BiImageAdd className="FileImg" size={30} />
                                                                <div className="FileTextLoad">Фотографии карточки</div>
                                                            </div>
                                                            <div className="FileClue">Нажмите на поле или перетащите файлы</div>
                                                            <div className="FileClue">Формат - png или jpeg (jpg)</div>
                                                        </div>
                                                        <div className="FileInfo repfilesSet">
                                                            <div className="FileText">
                                                                <AiOutlineFileImage size={30} />
                                                                <div className="FileTextLoad repfilesName"></div>
                                                            </div>
                                                            <div className="FileClue">Наведите курсор, чтобы увидеть названия файлов</div>
                                                        </div>
                                                    </div>
                                                    <div className="files FileClear repfilesClear" id="repfiles" name="files" onClick={clearFiles}>Очистить поле</div>
                                                    <div className="CreateWarning repWarning">Заполните все поля!</div>
                                                    <div className="CreateItemBtn" onClick={createNewItem}>Создать</div>
                                                    <div className="CreateCancelItemBtn" onClick={cancelCreate}>Отменить</div>
                                                </div>
                                            </>
                                        }
                                    </>
                                    :
                                    <>
                                        <div className="CreateBtn" onClick={() => setCreateRestored(true)}>Создать товар</div>
                                        {!createRestored ?
                                            <>
                                                {restored ?
                                                    <>
                                                        {!changeItem ?
                                                            <>
                                                                {restored.length > 0 ?
                                                                    <>
                                                                        {!canDelete ?
                                                                            <div className="DeleteContainer">
                                                                                <div className="DeleteBtn" onClick={deleteMany}>Удалить выбранное</div>
                                                                                <div className="ThrowCheck" onClick={checkboxThrow}>Сбросить выбор</div>
                                                                            </div>
                                                                            :
                                                                            <div className="DeleteConfirm">
                                                                                <div className="ConfirmText">Вы уверены, что хотите удалить выбранные товары?</div>
                                                                                <div className="ConfirmBtns">
                                                                                    <div className="DeleteBtn" onClick={deleteConfirm}>Удалить</div>
                                                                                    <div className="DeleteCancel" onClick={cancelDelete}>Отменить</div>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        <div className="Clue">Для редактирования нажмите на нужный товар</div>
                                                                        <div className="TableWrap">
                                                                            <table>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th></th>
                                                                                        <th>Артикул</th>
                                                                                        <th>Фирма</th>
                                                                                        <th>Название</th>
                                                                                        <th>Хват</th>
                                                                                        <th>Загиб</th>
                                                                                        <th>Жесткость</th>
                                                                                        <th>Цена</th>
                                                                                        <th>Ремонт</th>
                                                                                    </tr>
                                                                                    {restored.map((item, i) => {
                                                                                        return (
                                                                                            <tr key={item.id} className="ItemRow">
                                                                                                <td onClick={(e) => checkboxClick(e, item.id)}>
                                                                                                    <input type="checkbox" className={`Checkbox Check${item.id}`} id={item.id} />
                                                                                                </td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.code}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.brand}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.name}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.grip}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.bend}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.rigidity}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.price}</td>
                                                                                                <td onClick={() => changeItemClick(item)}>{item.restore}</td>
                                                                                            </tr>
                                                                                        )
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    <div className="NoItems">Товаров нет</div>
                                                                }
                                                            </>
                                                            :
                                                            <div className="CreateContainer">
                                                                <div className="CreateSub">Редактирование товара</div>
                                                                <div className="InputClue">Артикул</div>
                                                                <input type="text" placeholder="Артикул" name="code" maxLength={250} value={changeItem.code} onChange={handleChangeItem} />
                                                                <div className="InputClue">Фирма</div>
                                                                <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={changeItem.brand} onChange={handleChangeItem} />
                                                                <div className="InputClue">Название</div>
                                                                <input type="text" placeholder="Название" name="name" maxLength={250} value={changeItem.name} onChange={handleChangeItem} />
                                                                <div className="InputClue">Описание</div>
                                                                <textarea placeholder="Описание" name="description" value={changeItem.description} onChange={handleChangeItem}></textarea>
                                                                <div className="InputClue">Цена</div>
                                                                <input type="text" placeholder="Цена" name="price" maxLength={9} value={changeItem.price} onChange={handleChangeItem} />
                                                                <div className="InputClue">Хват</div>
                                                                <input type="text" placeholder="Хват" name="grip" maxLength={250} value={changeItem.grip} onChange={handleChangeItem} />
                                                                <div className="InputClue">Загиб</div>
                                                                <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={changeItem.bend} onChange={handleChangeItem} />
                                                                <div className="InputClue">Жесткость</div>
                                                                <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={changeItem.rigidity} onChange={handleChangeItem} />
                                                                <div className="InputClue">Ремонт</div>
                                                                <input type="text" placeholder="Ремонт" name="restore" maxLength={250} value={changeItem.restore} onChange={handleChangeItem} />
                                                                <div className="CreateItemBtn" onClick={changeConfirm}>Сохранить</div>
                                                                <div className="CreateCancelItemBtn" onClick={cancelChange}>Отменить</div>
                                                            </div>
                                                        }
                                                    </>
                                                    :
                                                    <div className="LoaderContainer2">
                                                        <div className="LoaderLight"></div>
                                                    </div>
                                                }
                                            </>
                                            :
                                            <>
                                                <div className="CreateContainer">
                                                    <div className="CreateSub">Добавление товара</div>
                                                    <div className="InputClue">Артикул</div>
                                                    <input type="text" placeholder="Артикул" name="code" maxLength={250} value={data.code} onChange={handleChange} />
                                                    <div className="InputClue">Фирма</div>
                                                    <input type="text" placeholder="Фирма" name="brand" maxLength={250} value={data.brand} onChange={handleChange} />
                                                    <div className="InputClue">Название</div>
                                                    <input type="text" placeholder="Название" name="name" maxLength={250} value={data.name} onChange={handleChange} />
                                                    <div className="InputClue">Описание</div>
                                                    <textarea placeholder="Описание" name="description" value={data.description} onChange={handleChange}></textarea>
                                                    <div className="InputClue">Цена</div>
                                                    <input type="text" placeholder="Цена" name="price" maxLength={9} value={data.price} onChange={handleChange} />
                                                    <div className="InputClue">Хват</div>
                                                    <input type="text" placeholder="Хват" name="grip" maxLength={250} value={data.grip} onChange={handleChange} />
                                                    <div className="InputClue">Загиб</div>
                                                    <input type="text" placeholder="Загиб" name="bend" maxLength={9} value={data.bend} onChange={handleChange} />
                                                    <div className="InputClue">Жесткость</div>
                                                    <input type="text" placeholder="Жесткость" name="rigidity" maxLength={9} value={data.rigidity} onChange={handleChange} />
                                                    <div className="InputClue">Ремонт</div>
                                                    <input type="text" placeholder="Ремонт" name="restore" maxLength={250} value={data.restore} onChange={handleChange} />
                                                    <div className="CreateWarning restWarning">Заполните все поля!</div>
                                                    <div className="CreateItemBtn" onClick={createOldItem}>Создать</div>
                                                    <div className="CreateCancelItemBtn" onClick={cancelCreate}>Отменить</div>
                                                </div>
                                            </>
                                        }
                                    </>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default Admin;