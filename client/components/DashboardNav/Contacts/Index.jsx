import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native'
import { Link } from 'react-router-native';
import s from '../../style/styleSheet';
import { LinearGradient } from 'expo-linear-gradient';
import Axios from 'axios';
import env from '../../../env';
import colors from '../../style/colors';
import { Controller, useForm } from 'react-hook-form';
import { ListItem, Avatar } from 'react-native-elements'
import IonIcon from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
//actions
import { getContacts } from '../../../redux/actions/contact';

import List from './List';

function Index(props) {
    const { token, user, getContacts, contacts, isFetching } = props;

    // const [ allContacts, setAllContacts ] = useState(null);
    // const [ contacts, setContacts ] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalError, setModalError] = useState(null)
    const [dis, setDis] = useState(false);
    const { control, errors, handleSubmit } = useForm();

    const onSubmit = data => {
        setDis(true);
        Axios.post(`${env.API_URI}/contacts`, JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => getContacts(token))
        .then(() => {
            setDis(false);
            setModalVisible(!modalVisible);
        })
        .catch(err => {
            setDis(false);
            console.log('error de agregancia')
            setModalVisible(!modalVisible);
        })
    }

    const filtrarContactos = nombre => {
        nombre = nombre.toLowerCase()
        setContacts(allContacts.filter(contact => (contact.nickname.toLowerCase().includes(nombre.toLowerCase()))))
    }

    useEffect(() => {
        getContacts(token);
    }, [])
    return (
        <View style={{ ...s.container, marginTop: 0 }}>
            <LinearGradient
                // Background Linear Gradient
                colors={['rgba(0,0,0,0.8)', 'transparent']}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 300,
                }}
            />
            <View>
                <Text style={{ ...s.textWhite, ...s.size(6), ...s.textCenter, fontWeight: 'bold' }}>Contactos</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', ...s.mt(5) }}>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <TextInput
                            style={{ ...s.input, ...s.mt(4), ...s.mb(4), ...s.mr(2), flex: 5 }}
                            // onChangeText={(value) => {
                            //     filtrarContactos(value)
                            //     return onChange(value)
                            // }}
                            onBlur={onBlur}
                            value={value}
                            placeholder="Busca un contacto..."
                            autoCapitalize="none"
                            />
                            )}
                    name="filtrar"
                    rules={{ required: false }}
                    defaultValue=""
                />
                {/* Agrege Estilos nuevos par el boton de agregar contacto */}
                <TouchableOpacity onPress={() => {
                    setModalVisible(true);
                }} style={{ flex: 1, width: 50, height: 50, borderRadius: 50, backgroundColor: colors.pink, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: colors.white, fontSize: 30, borderStyle: 'solid' }}>+</Text>
                </TouchableOpacity>
            </View> 
            <ScrollView style={{ ...s.mt(1) }}>
                {/* Contactos */}
                <View style={{ borderBottomColor: colors.pink, borderBottomWidth: 1, ...s.mb(5) }} />
                <List
                    contacts={contacts}
                    isFetching={isFetching}
                    token={token}
                    getContacts={getContacts}
                />

            </ScrollView>

            {/* Modal para agregar contactos */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ ...s.mt(20), backgroundColor: colors.blue, margin: 20, borderRadius: 10, padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.7 }} >
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,0,0,0.8)', 'transparent']}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            height: 300,
                            borderRadius: 10,
                        }}
                    />
                    {/* <View style={{ ...s.mb(3) }}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={s.textColor('orange')}>&lt; Volver</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View>
                        <Text style={{ ...s.textWhite, ...s.size(3) }}>Alias de Contacto *</Text>                        
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <TextInput
                                    style={{ ...s.input, ...s.mt(4), ...s.mb(4) }}
                                    onChangeText={(value) => onChange(value)}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder="Nombre"
                                    autoCapitalize="none"
                                    editable={!dis}
                                />
                            )}
                            name="nickname"
                            rules={{ required: true }}
                            defaultValue=""
                        />
                        <Text style={{ ...s.textWhite, ...s.size(3) }}>Email *</Text>
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <TextInput
                                    style={{ ...s.input, ...s.mt(4), ...s.mb(4) }}
                                    onChangeText={(value) => onChange(value)}
                                    onBlur={onBlur}
                                    value={value}
                                    keyboardType="email-address"
                                    placeholder="contacto@example.com"
                                    autoCapitalize="none"
                                    editable={!dis}
                                />
                            )}
                            name="email"
                            rules={{ required: true }}
                            defaultValue=""
                        />
                        {errors && <Text>{errors.message}</Text>}
                        <ActivityIndicator animating={dis} size="large" color={colors.pink} />
                        <TouchableOpacity
                            style={{ ...s.btn(), ...s.mb(5) }}
                            onPress={handleSubmit(onSubmit)}
                            disabled={dis}
                        >
                            <Text style={{ ...s.textCenter, ...s.textColor(colors.white) }}>AGREGAR</Text>
                        </TouchableOpacity>
                        <View><Text style={{ ...s.textWhite, ...s.size(3), ...s.pb(4), ...s.textCenter }}>Si el usuario no tiene Quantum se le enviara una invitación</Text></View>
                        <Text style={{ ...s.textWhite, ...s.size(2) }} >(*Campos obligatorios)</Text>
                    </View>
                </View>
            </Modal>
        </View>
    )
}


// const mapStateToProps = state => {
//     return {
//         token: state.auth.token,
//         user: state.auth.user,
//         contacts: state.contacts.list,
//         isFetching: state.contacts.isFetching
//     }
// }
// const mapDispatchToProps = dispatch => {
//     return {
//         getContacts: token => dispatch(getContacts(token)) 
//     }
// }
const mapStateToProps = state => {
    return {
        token: state.auth.token,
        user: state.auth.user,
        contacts: state.contacts.list,
        isFetching: state.contacts.isFetching
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getContacts: token => dispatch(getContacts(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);