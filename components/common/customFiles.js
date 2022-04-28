import { useState } from 'react'
import Files from 'react-files'

const CustomFiles = (props) => {
    const [files, setFiles] = useState([])

    function onFilesChange(newFiles) {
        setFiles([...files, ...newFiles])
        //console.log([...files, ...newFiles]);
    }
    
    function onFilesError(error, file) {
        alert('Ошибка при загрузке файла ' + error.code + ': ' + error.message)
        console.log('Ошибка при загрузке файла ' + error.code + ': ' + error.message)
    }

    function filesRemoveOne(e) {
        setFiles(files.filter(file => file.id !== e.target.dataset.fileid))
    }

    return (
        <>
            <Files
                className='flex justify-center items-center border rounded-lg cursor-pointer mb-4 '
                style={{ height: '50px' }}
                onChange={onFilesChange}
                onError={onFilesError}
                accepts={props.accepts || ['.doc', '.docx', '.pdf', '.odt']}
                multiple
                maxFiles={10}
                maxFileSize={5000000}
                minFileSize={0}
                clickable
            >
                Перенесите файлы сюда или кликните для загрузки
            </Files>
            {files && files.length > 0 
            &&
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
            }
        </>
    )
}

export default CustomFiles