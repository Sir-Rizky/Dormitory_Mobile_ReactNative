import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

// Titik lokasi referensi (Cibatu, Cikarang Selatan)
const REF_LAT = -6.325274;
const REF_LON = 107.172085;
const MAX_DISTANCE_KM = 5;

// Helper hitung jarak (Haversine)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const isAbsenTime = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour === 20;
};

const AbsenMalamScreen = () => {
  const navigation = useNavigation();
  const [absensi, setAbsensi] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [foto, setFoto] = useState(null);
  const [waktu, setWaktu] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [lokasi, setLokasi] = useState(null);
  const [error, setError] = useState('');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!isAbsenTime()) {
      setError('Absensi hanya bisa diakses pada jam 20:00 - 21:00');
    } else {
      setError('');
    }
  }, []);

  const requestPermissions = async () => {
    setLoading(true);
    const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus === 'granted');
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    setHasLocationPermission(locationStatus === 'granted');
    setLoading(false);
    return cameraStatus === 'granted' && locationStatus === 'granted';
  };

  const handleAddAbsen = async () => {
    if (!isAbsenTime()) {
      setError('Absensi hanya bisa diakses pada jam 20:00 - 21:00');
      return;
    }
    const granted = await requestPermissions();
    if (!granted) {
      Alert.alert('Izin dibutuhkan', 'Aplikasi membutuhkan izin kamera dan lokasi.');
      return;
    }
    setLoading(true);
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const dist = getDistanceFromLatLonInKm(loc.coords.latitude, loc.coords.longitude, REF_LAT, REF_LON);
    setLoading(false);
    if (dist > MAX_DISTANCE_KM) {
      Alert.alert('Lokasi terlalu jauh', 'Anda harus berada dalam radius 5 km dari titik absen.');
      return;
    }
    setLokasi({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    setCameraVisible(true);
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });
      setFoto(photo);
      setWaktu(new Date().toLocaleString());
      setCameraVisible(false);
      setShowForm(true);
    }
  };

  const handleSubmitAbsen = () => {
    if (!foto || !waktu || !lokasi) return;
    setAbsensi([
      ...absensi,
      {
        id: Date.now().toString(),
        waktu,
        keterangan,
        foto,
        lokasi,
      },
    ]);
    setShowForm(false);
    setFoto(null);
    setWaktu('');
    setKeterangan('');
    setLokasi(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.absenCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.absenLabel}>Waktu : <Text style={styles.absenValue}>{item.waktu}</Text></Text>
        <Text style={styles.absenLabel}>Keterangan : <Text style={styles.absenValue}>{item.keterangan}</Text></Text>
      </View>
      <Text style={styles.detailBtn}>{'>'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBtn}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Absen Malam</Text>
        <TouchableOpacity onPress={handleAddAbsen}>
          <Text style={styles.headerBtn}>+</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#294066" style={{ margin: 20 }} />}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : showForm ? (
        <View style={styles.formBox}>
          <Image source={{ uri: foto.uri }} style={styles.foto} />
          <Text style={styles.formLabel}>Waktu: {waktu}</Text>
          <Text style={styles.formLabel}>Lokasi: {lokasi.latitude}, {lokasi.longitude}</Text>
          <TextInput
            style={styles.input}
            placeholder="Keterangan"
            value={keterangan}
            onChangeText={setKeterangan}
          />
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitAbsen}>
            <Text style={styles.submitBtnText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={absensi}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Belum ada absensi malam.</Text>}
        />
      )}
      {/* Kamera Modal */}
      <Modal visible={cameraVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Camera
            style={{ flex: 1 }}
            ref={cameraRef}
            type={Camera.Constants.Type.front}
          />
          <TouchableOpacity style={styles.cameraBtn} onPress={handleTakePicture}>
            <Text style={styles.cameraBtnText}>Ambil Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraCancelBtn} onPress={() => setCameraVisible(false)}>
            <Text style={styles.cameraBtnText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#294066',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerBtn: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  absenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  absenLabel: { fontWeight: 'bold', color: '#222', marginBottom: 4 },
  absenValue: { fontWeight: 'normal', color: '#222' },
  detailBtn: { fontSize: 22, color: '#294066', fontWeight: 'bold', marginLeft: 8 },
  errorText: { color: 'red', textAlign: 'center', margin: 16, fontWeight: 'bold' },
  formBox: {
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#294066',
    borderRadius: 12,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
  },
  foto: { width: 100, height: 100, borderRadius: 8, marginBottom: 12 },
  formLabel: { color: '#294066', fontWeight: 'bold', marginBottom: 8 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  submitBtn: {
    backgroundColor: '#294066',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cameraBtn: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: '#294066',
    padding: 18,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 32,
  },
  cameraBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  cameraCancelBtn: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: '#888',
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 32,
  },
});

export default AbsenMalamScreen;