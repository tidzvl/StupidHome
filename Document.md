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

## Devices Endpoints

### Get Number of Devices

- **GET**  
  Description: Get number of devices have been added. Use for "Home" page.  
  Body:
  ```
  {
    house_id: string
  }
  ```
  Response: Number of devices.

### Get All Devices

- **GET**  
  Description: Get all devices use for all.  
  Body:
  ```
  {
    house_id: string
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

### Get Number of Devices by Room

- **GET**  
  Description: Get number of devices have been added by room. Use for "Analytics" page. Choose by room.  
  Body:
  ```
  {
    room_id: string
  }
  ```
  Response: Number of devices.

### Get Device Usage Time and Wat by List_ID

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
    device_id: string,
    status: [0,1], //post cái nào thì đổi db lại thành cái đó
    value: int, //null is default
    pinned: [false, true],
    note: string or img href, //null is default
    user_id: string
  }
  ```
  Response: 200.

### Create Device

- **POST**  
  Description: Create new device.  
  Body:
  ```
  {
    room_id: string,
    device_title: string,
    pinned: false,
    date_create: new Date(),
    user_id: string
  }
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
