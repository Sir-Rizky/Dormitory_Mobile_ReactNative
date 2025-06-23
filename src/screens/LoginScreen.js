import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ACCOUNTS = {
  penghuni: { nim: '0320230096', password: 'indah.096', name: 'Indah' },
  admin: { username: 'hammam.smit', password: 'hammam.101', name: 'Hammam Smit' },
  kemahasiswaan: { username: 'juwita.wita', password: 'juwita.116', name: 'Juwita Wita' },
};

const LoginScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const mode = route.params?.mode || 'penghuni';
  const [input1, setInput1] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState('');

  const placeholder = mode === 'penghuni' ? 'NIM' : 'Username';

  // Link logic
  const links = [
    { label: 'Penghuni', mode: 'penghuni' },
    { label: 'Admin', mode: 'admin' },
    { label: 'Kepala Kemahasiswaan', mode: 'kemahasiswaan' }
  ].filter(link => link.mode !== mode);

  const handleLogin = () => {
    setError('');
    if (mode === 'penghuni') {
      if (input1 === ACCOUNTS.penghuni.nim && password === ACCOUNTS.penghuni.password) {
        navigation.replace('DashboardPenghuni', { name: ACCOUNTS.penghuni.name });
        return;
      }
    } else if (mode === 'admin') {
      if (input1 === ACCOUNTS.admin.username && password === ACCOUNTS.admin.password) {
        navigation.replace('DashboardAdmin', { name: ACCOUNTS.admin.name });
        return;
      }
    } else if (mode === 'kemahasiswaan') {
      if (input1 === ACCOUNTS.kemahasiswaan.username && password === ACCOUNTS.kemahasiswaan.password) {
        navigation.replace('DashboardKemahasiswaan', { name: ACCOUNTS.kemahasiswaan.name });
        return;
      }
    }
    setError('NIM/Username atau Password salah!');
  };

  return (
    <ImageBackground
      source={require('../../assets/AstraBackground.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Logo ASTRAtech atas */}
        <Image source={require('../../assets/LogoAstra.png')} style={styles.logoAstra} resizeMode="contain" />
        <View style={styles.formContainer}>
          {/* Logo besar tengah */}
          <Image source={require('../../assets/Logo.png')} style={styles.logoCenter} resizeMode="contain" />
          {/* Judul */}
          <Text style={styles.title}>DORMITORY Mobile</Text>
          {/* Input NIM/Username */}
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={input1}
            onChangeText={setInput1}
            placeholderTextColor="#888"
            autoCapitalize="none"
          />
          {/* Input Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              placeholderTextColor="#888"
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeIcon}>
              <Text style={{ fontSize: 18 }}>{secureText ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>
          {/* Tombol Masuk */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>MASUK</Text>
          </TouchableOpacity>
          {/* Pesan error */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {/* Link admin dan kemahasiswaan */}
          <View style={styles.linkContainer}>
            {links.map(link => (
              <Text style={styles.linkText} key={link.mode}>
                {link.label}? <Text style={styles.linkBlue} onPress={() => {
                  setInput1(''); setPassword(''); setError(''); navigation.replace('Login', { mode: link.mode });
                }}>Klik disini.</Text>
              </Text>
            ))}
          </View>
        </View>
        {/* Copyright */}
        <Text style={styles.copyright}>Copyright © 2025 - MIS Politeknik Astra</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 100,
  },
  logoAstra: {
    width: 120,
    height: 40,
    marginBottom: 10,
    marginTop: 10,
  },
  logoCenter: {
    width: 90,
    height: 90,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    color: '#294066',
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#294066',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  linkContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  linkText: {
    color: '#222',
    fontSize: 13,
    marginBottom: 2,
  },
  linkBlue: {
    color: '#294066',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  copyright: {
    position: 'absolute',
    bottom: 10,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    width: '100%',
  },
});

export default LoginScreen; 