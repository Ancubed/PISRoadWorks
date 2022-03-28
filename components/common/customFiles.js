import { useState } from 'react'
import Files from 'react-files'

import FormButton from './formButton'

const CustomFiles = (props) => {
    const DEFAULT_MAX_FILE_COUNT = 7;
    const [files, setFiles] = useState([])

    function maxFileCount(filesState) {
        if (props.maxFiles && filesState.length > props.maxFiles || !props.maxFiles && filesState.length > DEFAULT_MAX_FILE_COUNT) {
            let err = new Error('maximum file count reached');
            err.code = 4;
            onFilesError(err);
            return true;
        }
        return false;
    }

    function onFilesChange(newFiles) {
        let newFilesState = [...files, ...newFiles];

        if (maxFileCount(newFilesState)) return;

        setFiles(newFilesState)
        //console.log([...files, ...newFiles]);
    }
    
    function onFilesError(error, file) {
        alert('Ошибка при загрузке файла ' + error.code + ': ' + error.message)
        console.log('Ошибка при загрузке файла ' + error.code + ': ' + error.message)
    }

    function filesRemoveOne(e) {
        setFiles(files.filter(file => file.id !== e.target.dataset.fileid))
    }

    function saveFiles() {
        alert('works');
    }

    return (
        <>
            {(props.maxFiles && files.length < props.maxFiles || !props.maxFiles && files.length < DEFAULT_MAX_FILE_COUNT)
            &&
            <Files
                className='flex justify-center items-center border border-dashed rounded-lg cursor-pointer mb-4 '
                style={{ height: '50px' }}
                onChange={onFilesChange}
                onError={onFilesError}
                accepts={props.accepts || ['.doc', '.docx', '.pdf', '.odt']}
                multiple
                maxFiles={props.maxFiles || DEFAULT_MAX_FILE_COUNT}
                maxFileSize={props.maxFileSize || 1000000}
                minFileSize={0}
                clickable
            >
                Перенесите файлы сюда или кликните для загрузки
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
                            <div className='ml-8'>
                                <span
                                    className="p-1 cursor-pointer hover:text-sky-600"
                                    onClick={filesRemoveOne}
                                    title='Удалить'
                                    data-fileid={file.id}
                                >
                                    У.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <FormButton type="button" text='Загрузить' onClick={saveFiles} className='my-2'/>
            </div>
            }
        </>
    )
}

export default CustomFiles