// este es el verificado de correo electrónico.

//General
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, TextInput, Modal, Alert} from 'react-native';
import React,{ useState, useEffect} from 'react';
import {Link} from 'react-router-native';
import { useForm, Controller } from "react-hook-form";
import {sendEmailVerifier} from '../redux/actions/email_verifier';

//Redux
import {connect} from 'react-redux';

//UI
import s from './style/styleSheet';


function EmailVerifier({email, error,sent, sendEmailVerifier}){

    const { control, handleSubmit, errors } = useForm();
    const onSubmit = data => console.log(data);

    const rules = {
        email: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    }

    const [state,setState] = useState({
        needCode: false,
        loading: false
    });

    const sendCode = data => {
        console.log(data);
        sendEmailVerifier(data);
    };

    const switchNeedCode = () => {
        setState({
            ...state,
            needCode: !state.needCode
        })
    }

    return (
        <ScrollView style={s.container}>

        
            {error && (<Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    }}
                >

                        <View style={{ ...s.bg('#fff') }}>
                            <Text>{error.status}</Text>
                        </View>
                
                
                </Modal>
            )}

            <View style={{ ...s.mb(5)}}>
                <Link to="/" component={TouchableOpacity}>
                    <Text style={s.textColor('orange')}> &lt; Volver al inicio</Text>
                </Link>
            </View>
            <Text style={{ ...s.textWhite, fontSize:20, textAlign:'center', ...s.mb(5) }}>
                Verificación de correo electrónico
            </Text>

            {state.needCode && (
                <Text style={{ ...s.mb(4),...s.textWhite }}>
                    Te enviaremos un nuevo código.
                    <Link onPress={switchNeedCode} style={s.textColor('orange')} component={Text}>
                        {" "}¿Ya tienes un código?
                    </Link>
                </Text>
            )}

            {!state.needCode && (
                <Text style={{ ...s.mb(4),...s.textWhite }}>
                    Te enviamos un correo electrónico con
                    <Text style={{ fontWeight:'bold' }}> un código de verificación</Text>.
                    <Link onPress={switchNeedCode} style={s.textColor('orange')} component={Text}>
                        {" "}¿Aún no te llegó el código?
                    </Link>
                </Text>
            )}

            {(email === null || state.needCode) && (
                <View style={s.mb(4)}>
                    <Controller
                        control={control}
                        render={({onChange, onBlur, value}) => (
                            <TextInput
                                style={{ ...s.input }}
                                placeholder="Correo electrónico"
                                keyboardType="email-address"
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                //No estoy seguro si estos dos siguientes son necesarios así que por las dudas los dejo comentados
                                //textContentType="emailAddress"
                                autoCompleteType="email"
                                />
                        )}
                        name="email"
                        rules={{
                            required: true,
                            pattern: rules.email,
                            maxLength: 191,
                        }}
                        defaultValue={email}
                    />
                    {errors.email?.type === "required" &&
                      <Text style={s.textColor('red')}>Debes ingresar tu correo electrónico</Text>}
                    {errors.email?.type === "pattern" &&
                      <Text style={s.textColor('red')}>El correo electrónico ingresado no es válido</Text>}
                    {errors.email?.type === "maxLength" &&
                      <Text style={s.textColor('red')}>El correo electrónico no puede exceder los 191 caracteres</Text>}
                </View>
            )}           

            {!state.needCode && (
                <View style={s.mb(4)}>
                    <TextInput
                    style={{ ...s.input }}
                    placeholder="Ingrese el código"
                    keyboardType='numeric'
                    //No estoy seguro si estos dos siguientes son necesarios así que por las dudas los dejo comentados
                    // textContentType="emailAddress"
                    // autoCompleteType="email"
                    />
                </View>
            )}

            <View>
                {!state.needCode && (<Link component={TouchableOpacity} style={s.btn()}>
                    <Text style={{ fontWeight:'bold',...s.textColor('white') }}>
                        {!state.loading && 'VERIFICAR'}
                        {state.loading && 'CARGANDO...'}
                    </Text>
                </Link>)}
                {state.needCode && (<Link onPress={handleSubmit(sendCode)} component={TouchableOpacity} style={s.btn()}>
                    <Text style={{ fontWeight:'bold',...s.textColor('white') }}>
                        {!state.loading && 'ENVIAR CODIGO'}
                        {state.loading && 'CARGANDO...'}
                    </Text>
                </Link>)}
            </View>
        </ScrollView>
    );
}

function mapStateToProps(state) {
    return {
        email: state.auth.user.email,
        error: state.email_verifier.error,
        sent: state.email_verifier.sent
    }
}

function mapDispatchToProps(dispatch) {
    return {
        sendEmailVerifier: data => dispatch(sendEmailVerifier(data))
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EmailVerifier);