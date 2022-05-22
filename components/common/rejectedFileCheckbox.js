import { useState } from 'react'

const RejectedFileCheckbox = ({ roadworkId, fileId, isRejected }) => {
    const [checked, setChecked] = useState(!isRejected)

    const getResponse = async () => {
        let body = { fileId, checked }
        return await fetch(`/api/roadworks/${roadworkId}/toggle-reject-document`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        });
    }

    const handleCheckFile = async (id) => {
        let response = await getResponse()
        if (response.ok) {
            let json = await response.json()
            if (json.isSuccess) {
                setChecked(!checked);
            }
        } else {
            alert('Ошибка при отметке файла')
        }
    }

    return (
        <input 
            type="checkbox" 
            checked={ checked } 
            title="Верен ли документ?"
            onChange={ () => handleCheckFile(fileId) } 
        />
    )
}

export default RejectedFileCheckbox