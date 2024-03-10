import psutil
import platform

def get_cpu_load():
    return psutil.cpu_percent(interval=1)

def get_cpu_temperature():
    if platform.system().lower() == 'linux':
        try:
            temperature_info = psutil.sensors_temperatures()
            if 'cpu_thermal' in temperature_info:
                return temperature_info['cpu_thermal'][0].current
            else:
                return None
        except Exception as e:
            print(f"Error getting temperature: {e}")
            return None
    else:
        print("Temperature monitoring is only supported on Linux.")
        return None

if __name__ == "__main__":
    cpu_load = get_cpu_load()
    cpu_temperature = get_cpu_temperature()

    if cpu_load is not None:
        print(f"CPU Load: {cpu_load}%")

    if cpu_temperature is not None:
        print(f"CPU Temperature: {cpu_temperature}°C")
