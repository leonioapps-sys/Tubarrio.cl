
import { useState, useCallback } from 'react';
import { Coordinates } from '../types';

interface GeolocationState {
    loading: boolean;
    error: GeolocationPositionError | null;
    location: Coordinates | null;
}

const useGeolocation = () => {
    const [state, setState] = useState<GeolocationState>({
        loading: false,
        error: null,
        location: null,
    });

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        setState(prevState => ({ ...prevState, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    loading: false,
                    error: null,
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                });
            },
            (error) => {
                setState({
                    loading: false,
                    error,
                    location: null,
                });
            }
        );
    }, []);

    return { ...state, requestLocation };
};

export default useGeolocation;
