import React, {useState } from 'react';
import Context from "./FormContext";

const FormProvider = ({ children}) => {
    const [ceps, setCeps] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [except, setException] = useState(false);
    const [citys, setCitys] = useState([]);
    const [customs, setCustoms] = useState([]);

    return (
        <Context.Provider
            value={{
                ceps,
                setCeps,
                districts,
                setDistricts,
                except,
                setException,
                citys,
                setCitys,
                customs,
                setCustoms
            }}
        >
            {children}
        </Context.Provider>
    )

}

export default FormProvider;