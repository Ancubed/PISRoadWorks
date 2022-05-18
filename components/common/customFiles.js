import { useState } from 'react'
import Image from 'next/image'
import Files from 'react-files'

import { MAX_FILES_COUNT } from '../../lib/constants'

import FormButton from './formButton'

const generateUrl = (roadwork = null) => {
    let url = '/api/files';
    if (roadwork) {
        url += `?roadwork=${roadwork}`;
    }
    return url;
}

const FILE_ERRORS = {
    1: 'Запрещенный формат файла',
    2: 'Файл слишком мальенький',
    3: 'Файл слишком большой',
    4: 'Достигнут лимит количества файлов'
}

const CustomFiles = (props) => {
    const [files, setFiles] = useState(props.file || [])

    function maxFileCount(filesState) {
        if (props.maxFiles && filesState.length > props.maxFiles || !props.maxFiles && filesState.length > MAX_FILES_COUNT) {
            return true;
        }
        return false;
    }

    function onFilesChange(newFiles) {
        let newFilesState = [...files, ...newFiles];
        console.log(newFilesState);

        if (maxFileCount(newFilesState)) return;

        setFiles(newFilesState)
    }
    
    function onFilesError(error, file) {
        alert('Ошибка при выборе файлов: ' + FILE_ERRORS[error.code] || error.message)
        console.log('Ошибка при выборе файлов: ' + FILE_ERRORS[error.code] || error.message)
    }

    function filesRemoveOne(e) {
        setFiles(files.filter(file => file.id !== e.target.dataset.fileid))
    }

    async function uploadFiles(e) {
        if (files && files.length != 0) {
            let formData = new FormData();
            files.map(file => formData.append('files', file))
            let response = await fetch(generateUrl(props.roadwork), {
                method: 'post',
                body: formData
            });
            try {
                let json = await response.json()
                if (props.submitCallback) {
                    props.submitCallback(json)
                }
            } catch (err) {
                console.error(err);
                alert('Ошибка при загрузке файлов')
            }
            
        }
    }

    return (
        <>
            {(props.maxFiles && files.length < props.maxFiles || !props.maxFiles && files.length < MAX_FILES_COUNT)
            &&
            <Files
                className='flex justify-center items-center border border-dashed rounded-lg cursor-pointer mb-4 '
                style={{ height: '50px' }}
                onChange={onFilesChange}
                onError={onFilesError}
                accepts={props.accepts || ['.doc', '.docx', '.pdf', '.odt']}
                multiple
                maxFiles={props.maxFiles || MAX_FILES_COUNT}
                maxFileSize={props.maxFileSize || 10000000}
                minFileSize={0}
                clickable
            >
                <div className='flex justify-center'>
                    <Image src="/cloud-upload.svg" alt="" width={16} height={16} />
                    <span className='ml-2'>Перенесите файлы сюда или кликните для загрузки</span>
                </div>
            </Files>}
            {files && files.length > 0 
            &&
            <div className="flex flex-col">
                <div className="flex flex-col">
                    {files.map((file, key) => 
                        <div className='flex py-2' key={key}>
                            <div className='flex justify-between flex-grow'>
                                <span className='font-semibold'>{file.name}</span>
                                <span className='font-light'>{file.sizeReadable}</span>
                            </div>
                            <div className='ml-8 flex justify-center'>
                                <Image
                                    src="/x.svg"
                                    className="p-1 cursor-pointer hover:text-blue-600"
                                    onClick={filesRemoveOne}
                                    title='Удалить'
                                    data-fileid={file.id}
                                    width={16} 
                                    height={16}
                                    alt="У."
                                />
                            </div>
                        </div>
                    )}
                </div>
                <FormButton type="submit" text='Загрузить' onClick={uploadFiles} className='my-2'/>
            </div>
            }
        </>
    )
}

export default CustomFiles