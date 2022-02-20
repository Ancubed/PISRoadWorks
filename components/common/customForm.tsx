import React, { useState, useRef, useEffect } from "react";
import { YMaps, Map, Polyline, Button, MapState } from 'react-yandex-maps';
import { IEvent, GeoObject, ILineStringGeometry, Map as IMap, util,  } from "yandex-maps";

interface Field {
    type: string,
    id: string,
    labelText: string,
    required: boolean,
    value?: string,
    defaultValue?: string,
    disabled?: boolean,
    options?: [Option]
    min?: string
    coords?: number[][]
}

interface Option {
    value: string,
    text: string
}

interface CustomFormProps {
    fields: Field[],
    buttonText: string,
    method: string // Заменить на enum
    url: string
    disableButton?: boolean
}

interface Data {
    [propName: string]: string;
}

const CustomForm = (props: CustomFormProps) => {

    const [error, setError] = useState(false)
    const [isSuccess, setSuccess] = useState(false)
    const [message, setMessage] = useState(false)
    const [editable, setEditable] = useState(false)
    const [coords, setCoords] = useState<number[][]>(props.fields?.find(field => field.coords)?.coords || [])
    const mapRef = useRef<IMap>(null);
    const polylineRef = useRef<GeoObject<ILineStringGeometry>>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function getInitialCoords(e: IEvent) {
        let pointerCoords = e.get('coords');
        setCoords([pointerCoords]);
        mapRef?.current?.events?.remove('click', getInitialCoords)
    }

    function coordsStateSync(e:IEvent) {
        setCoords(e.originalEvent?.target?.geometry?._coordPath?._coordinates || [[0, 0]]);
    }

    if (!props.fields) throw new Error('Не передан props fields')
    
    useEffect(() => { 
        //console.log(editable, mapRef.currentMap.events)
        let currentMap = mapRef?.current; 
        let currentPolyline = polylineRef?.current; 
        let cursor: util.cursor.Accessor;
        if (editable && currentMap && currentPolyline) {
            if (!coords || coords.length == 0) currentMap.events?.add('click', getInitialCoords);
            cursor = currentMap.cursors.push('pointer');
            currentPolyline.editor?.startEditing();
            currentPolyline.events?.add('geometrychange', coordsStateSync);
        }

        return () => {
            if (editable && currentMap && currentPolyline) {
                if (cursor) cursor.remove();
                currentPolyline.editor?.stopEditing();
            }
        }
    }, [editable, coords, mapRef, getInitialCoords]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()

            const completedFields = Array.from(event.currentTarget.elements)

            if (completedFields.length < 2) throw new Error('Форма пуста')

            const data: Data = {};

            completedFields.forEach((field) => {
                console.log(field)
                let name = (field as HTMLInputElement).name;
                let value = (field as HTMLInputElement).value;
                if (name) data[name] = value;
            })

            console.log(data);

            const JSONdata = JSON.stringify(data);
            const response = await fetch(props.url, {
                body: JSONdata,
                headers: {
                    'Content-Type': 'application/json',
                },
                method: props.method,
            });
            if (!response.ok) throw new Error(`Ошибка ${response.status} - ${response.statusText}`)

            let json = await response.json();

            if (!json) throw new Error('Сервер не отправил ответ');

            if (!json.isSuccess) throw new Error(json.message || 'Непредвиденная ошибка');

            setError(false);
            setSuccess(true);
            setMessage(json.message || '');
        } catch(err: any) {
            setSuccess(false);
            setError(true);
            setMessage(err.message);
        }
    }

    const generateField = (field: Field, key: any) => {
        if (!field.type || !field.id || !field.labelText)
            throw new Error('Не задан type, id или labelText')

            return (
                <div key={key} className="flex flex-col mb-4">
                        <label htmlFor={field.id}>{field.labelText}</label>
                        {
                            (field.type == 'text' || field.type == 'password' || field.type == 'email') 
                            &&  
                            <input
                                className="h-8"
                                type={field.type}
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                disabled={field.disabled}
                                defaultValue={field.value}
                                maxLength={64}
                            />
                        }
                        {
                            field.type == 'select' 
                            && 
                            <select
                                className="h-8"
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                disabled={field.disabled}
                                defaultValue={field.value || field.options[0].value}
                            >
                                {field.options?.map((option: Option, key: any) => (
                                    <option value={option.value} key={key}>
                                        {option.text}
                                    </option>
                                ))}
                            </select>
                        }
                        {
                            (field.type == 'date') 
                            &&  
                            <input
                                className="h-8"
                                type={field.type}
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                disabled={field.disabled}
                                defaultValue={field.value}
                                min={field.min}
                            />
                        }
                        {
                            (field.type == 'textarea') 
                            &&  
                            <textarea
                                className="h-24"
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                disabled={field.disabled}
                                defaultValue={field.value}
                                maxLength={512}
                            />
                        }
                        {
                            (field.type == 'coordinates') 
                            && 
                            <div>
                                <YMaps>
                                    <Map
                                        defaultState={{
                                            center: [51.786, 55.104],
                                            zoom: 11,
                                            autoFitToViewport: 'always'
                                        }}
                                        className='w-full h-80'
                                        instanceRef={mapRef}
                                    >
                                    <Button
                                        options={{ maxWidth: 128 }}
                                        data={{ content: 'Рисовать' }}
                                        defaultState={{ selected: false }}
                                        onPress={() => setEditable(!editable)}
                                    />
                                    <Polyline
                                        modules={["geoObject.addon.editor"]}
                                        geometry={coords}
                                        options={{
                                            balloonCloseButton: false,
                                            strokeColor: '#000',
                                            strokeWidth: 4,
                                            strokeOpacity: 0.5,
                                            editorMaxPoints: 10,
                                            draggable: editable
                                        }}
                                        instanceRef={polylineRef}
                                    />
                                    </Map>
                                </YMaps>
                                <input
                                    className="hidden"
                                    id={field.id}
                                    name={field.id}
                                    required={field.required}
                                    defaultValue={JSON.stringify(coords)}
                                />
                            </div> 
                        }
                </div>
            )
    }

    return (
        <form 
        onSubmit={handleSubmit} 
        className={`p-4 border-2 rounded ${error && 'border-rose-500'} ${isSuccess && 'border-green-500'}`}>
            {props.fields.map((field, key) => generateField(field, key))}
            {message 
            && 
            <span 
            className={`flex justify-center my-4 ${error && 'text-rose-500'} ${isSuccess && 'text-green-500'}`}>
                {message}
            </span>}
            <button
                disabled={props.disableButton}
                type="submit"
                className="flex grow w-full justify-center p-2 rounded border-2"
            >
                {props.buttonText || 'Отправить'}
            </button>
        </form>
    )
}

export default CustomForm
