# API requirements

## Users Endpoints

### Register

- **POST**  
  Description: Register new users.  
  Body:
  ```
  {
    username: string,
    password: string,
    email: string,
    date: Date()
  }
  ```
  Response: 200

### Login

- **POST**  
  Description: Login account. (email | username)  
  Body:
  ```
  {
    username: string,
    password: string,
    email: string
  }
  ```
  Response: 200 and all simple information of that user.

## Sensors Endpoints

### Get Simple Data

- **GET**  
   Description: Get humidity, light, soilhumidity, pir, temp value of room ID. Use for "Home" page.  
   Body:

  ```
  {
    room_id: string
  }
  ```

  #k cần body chỗ này nhé -> param đi
  sensorData/<int:roomid>
  <br>
  #Ôkê em. Nếu dùng param thì các lệnh get by id còn lại nên dùng param luôn!

  Response: List of value.

- **GET**  
  Description: Get humidity, light, soilhumidity, pir, temp value of room ID on time. Use for "Analytics" page. Choose to change by day, week, month.  
  Body:
  ```
  {
    room_id: string,
    start_time: Date(),
    end_time: Date()
  }
  ```
  Response: return list of avg value of day from start to end.


  example input:
  http://127.0.0.1:8000/api/v1/sensorDataTime/1
{
  "room_id": "1",
  "start_time": "2025-02-14T00:00:00",
  "end_time": "2025-04-14T23:59:59"
}


## Devices Endpoints

### Get Number of Devices

- **GET**  
  Description: Get number of devices have been added. Use for "Home" page.  
  Body:
  ```
  {
    house_id: string => INT
  }
  ```
  Response: Number of devices.
http://127.0.0.1:8000/api/v1/getNumberOfDevices/1


### Get All Devices

- **GET**  
  Description: Get all devices use for all.  
  Body:
  ```
  {
    house_id: string => INT
  }
  ```
  Response: All devices. Recommend structure is
  ```
  {
    room_id: string,
    room_title: string,
    devices: [
      ... device ...
    ]
  }
  ```

  http://127.0.0.1:8000/api/v1/getAllDevices/1
  example output:
  [
    {
        "room_id": 1,
        "room_title": "Living Room",
        "devices": [
            {
                "device_id": 2,
                "name": "Fan 2",
                "type": "fan",
                "brand": "Panasonic",
                "value": "OFF",
                "on_off": false,
                "pinned": false,
                "date_created": "2025-03-31T00:10:31.962"
            },
            {
                "device_id": 1,
                "name": "Fan 1",
                "type": "fan",
                "brand": "Panasonic",
                "value": "01072",
                "on_off": true,
                "pinned": false,
                "date_created": "2025-03-31T00:10:31.962"
            }
        ]
    },
    {
        "room_id": 2,
        "room_title": "Bedroom",
        "devices": [
            {
                "device_id": 7,
                "name": "Smart Light",
                "type": "light",
                "brand": "Philips",
                "value": "75%",
                "on_off": true,
                "pinned": false,
                "date_created": "2025-03-31T00:10:44.341"
            },
            {
                "device_id": 3,
                "name": "Fan 1",
                "type": "fan",
                "brand": "Dyson",
                "value": "OFF",
                "on_off": false,
                "pinned": false,
                "date_created": "2025-03-31T00:10:31.962"
            },
            {
                "device_id": 4,
                "name": "Fan 2",
                "type": "fan",
                "brand": "Dyson",
                "value": "OFF",
                "on_off": false,
                "pinned": false,
                "date_created": "2025-03-31T00:10:31.962"
            }
        ]
    },
    {
        "room_id": 3,
        "room_title": "Kitchen",
        "devices": [
            {
                "device_id": 5,
                "name": "Fan 1",
                "type": "fan",
                "brand": "Samsung",
                "value": "OFF",
                "on_off": false,
                "pinned": false,
                "date_created": "2025-03-31T00:10:31.962"
            },
            {
                "device_id": 6,
                "name": "Fan 2",
                "type": "fan",
                "brand": "Samsung",
                "value": "OFF",
                "on_off": false,
                "pinned": false,
                "date_created": "2025-03-31T00:10:31.962"
            }
        ]
    }
]

### Get Number of Devices by Room

- **GET**  
  Description: Get number of devices have been added by room. Use for "Analytics" page. Choose by room.  :)) mặc định là của house_id 1 nhá 
  Body:
  ```
  {
    room_id: string -> INT
  }
  ```
  Response: Number of devices.

  http://127.0.0.1:8000/api/v1/getNumberDevicesInRoom/2

### Get Device Usage Time and Wat by List_ID :) hm đang bug... chờ tí nhá

- **GET**  
  Description: Calcutation Wat on day by list devices id. Use for "Mức Tiêu Thụ Năng Lượng" chart.  
  Body:
  ```
  {
    device_id: [string],
    start_time: Date(),
    end_time: Date()
  }
  ```
  Response: Recommand structure, with each array representing one day, calculated from 00:00 to 23:59, each array can contain one or multiple devices.
  ```
  {
    [
      {
        device_id: string,
        wat: int
      },
      {
        device_id: string,
        wat: int
      },
      ...
    ],
    [
      {
        device_id: string,
        wat: int
      },
      {
        device_id: string,
        wat: int
      },
      ...
    ],
    ...
  }
  ```

### Devices Event

- **POST**  
  Description: Turn on/off/change value devices.  
  Body:
  ```
  {
    device_id: int,
    on_off = true, //post cái nào thì đổi db lại thành cái đó
    value: int, //null is default
    pinned: [false, true],
    user_id: string
  }
  ```
  mới update lại
  Response: 200.
  example input:
  {
  "device_id": 6,
  "on_off": true,
  "value": "30",
  "pinned": false,
  "user_id": 5
}


### Create Device

- **POST**
- Description: Create new device. 
- http://127.0.0.1:8000/api/v1/createDevice
  Body:
  ```
  
  {
  "name": "string",
  "type": "string",
  "brand": "string",
  "value": "string",
  "room_id": "string",
  "on_off": false,
  "pinned": false,
  "date_create": "new Date()",
  "user_id": "string"
}
// mới update lại á
 
  ```
  Response: 200

## Logs Endpoints

### Get all logs by house

- **GET**  
  Description: Get all logs of house.  
  Body:
  ```
  {
    house_id: string
  }
  ```
  Response: All logs of house.

### Get logs by device id

- **GET**  
  Description: Get all logs of a device id.  
  Body:
  ```
  {
    device_id: string
  }
  ```
  Response: All logs of device id.

## Data Analysis
