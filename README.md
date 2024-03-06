# Auccommerce

Live Auction with Auccommerce in real time bid. Live bid using socket io connection for real time live bid auction. Auction winner will be prompted to payment page pay the bid price. This web is using Xendit as payment gateway.

## Tech Stack

### Languages

- Javascript - Frontend and backend language
- HTML - Markup language in frontend
- CSS & SCSS - For styling purposes
- JSON - For data structure

### Frontend

- Vite - Frontend tooling with HMR for faster development
- ReactJs - Frontend core framework
- React Redux - For state management in reactJS
- Redux Saga - Side Effects management in Redux
- Material UI - Library UI components
- SCSS - For CSS preprocessor

### Backend

- NodeJS & ExpressJS - Web app framework in javascript runtime
- Xendit Payment Gateway - For payment gateway solution
- Cloudinary - For file storing and host solution
- Socket.IO - For enabling bidirectional connection for real-time communication between frontend and backend

### Database & Cache

- Sequelize ORM - Library for database management tool for managing database solution
- MySQL - Open source RDBMS for storing datas
- Redis - For caching solution to reduce database load

## Setup Project

### Setup Frontend

> 1. execute `npm install --save`
> 2. execute `npm start`
> 3. access `localhost:<port>`

### Setup Backend

> 1. Start mysql server and redis server first to continue
> 2. write .env config to config the server
>
> `NODEJS_PORT=<port>` </br> > `NODE_ENV=<development | test | production>` </br> > `MYSQL_CONFIG_HOST=<dbHost>` </br> > `MYSQL_CONFIG_USER=<dbUser>` </br> > `MYSQL_CONFIG_PASSWORD=<dbPassword>` </br> > `MYSQL_CONFIG_DATABASE_DEV=<dbNameDev>` </br> > `MYSQL_CONFIG_DATABASE_TEST=<dbNameTest>` </br> > `MYSQL_CONFIG_DATABASE_PROD=<dbNameProd>` </br> > `MYSQL_CONFIG_DIALECT=<msql>` </br> > `MYSQL_CONFIG_PORT=<dbPort>` </br> > `MYSQL_CONFIG_CONNECTION_LIMIT=<default '1'>` </br> > `JWT_SECRET_TOKEN=<tokenSecrete>` </br> > `JWT_EXPIRES_IN=<default '30d'>` </br> > `CRYPTO_SECRET=<encryptSecret>` </br> > `PAYMENT_FORM_SIGN_KEY=<paymentTokenSecret>` </br> > `XENDIT_SECRET_KEY=<xenditSecretKey - "get xendit key from xendit dashboard, go to settings > API Keys > API Keys section > click Generate secret key > set API key name > set all permissions to write except money-out products > copy generated key"`
>
> 2. execute `npm i --save`
> 3. execute `npx sequelize-cli db:create`
> 4. execute `npx sequelize-cli db:migrate`
> 5. execute `npm start` to start the server
> 6. to access the server, access using endpoint `locahost:<port>/api/`

## Screenshots Pages

#### Home

Halaman home page untuk mencari barang lelang yang sudah didaftarkan di web
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485695/Screenshot_2024-03-03_231503_zxdmnt.png)

#### Item Detail

Halaman detail barang untuk menampilkan informasi barang sperti gambar dan beberapa deskripsi. Jika user sudah login, tekan gabung lelang live untuk ikut siaran lelang yang secara langsung.
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485694/Screenshot_2024-03-03_190836_xktn5h.png)

#### Item Detail Live Bid

Halaman detail barang dengan live bid page. User pembeli lelang dapat memasukkan nominal tawaran yang diinginkan. Nominal tawaran harus lebih tinggi dibandingkan harga tawaran tertinggi. User pembeli dapat menggunakan template penambahan harga di bawah input
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485694/Screenshot_2024-03-03_190854_fghxkm.png)

#### My Bids

Halaman untuk menampilkan hasil tawaran sebelumnya. user yang memenangkan lelang dapat menekan tombol bayar untuk bayar hasil tawaran.
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485695/Screenshot_2024-03-03_191952_sqvmj0.png)

#### Payment page

Halaman multi-step form untuk payment. Pembeli harus mengisi semua step yang disediakan oleh multi-step form tersebut.
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485694/Screenshot_2024-03-03_191801_p7pzaw.png)
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485694/Screenshot_2024-03-03_191920_qhibvx.png)
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485695/Screenshot_2024-03-03_191930_lyovt2.png)
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485695/Screenshot_2024-03-03_191941_rlbsam.png)

#### My Bid Detail

Halaman yang menampilkan status dan data transaksi yang sudah dilakukan
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485696/Screenshot_2024-03-03_192016_femcya.png)

#### Profile

Halaman untuk mengubah informasi profil. User dapat menambahkan foto dengan menekan tobol ganti gambar. Setelah beberapa informasi sudah diganti, tekan tombol simpan.
User juga dapat menambah alamat dengan tekan tombol tambah dan popup form akan muncul User juga dapat mengubah informasi alamat dengan menekan tombol pensil, serta dapat menghapus alamat dengan menekan tombol merah. User juga dapat mengubah password dengan memasukkan password lama terlebih dahulu dan password baru dan juga konfirmasi password. setelah itu, user menekan tombol simpan di bawah field.
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485694/Screenshot_2024-03-03_191833_bwd5xc.png)
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709487332/Screenshot_2024-03-03_191846_kghnno.png)
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709487332/Screenshot_2024-03-03_191846_kghnno.png)

#### My Auction

Halaman ini untuk menampilkan data lelang yang sudah dibuat
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709487723/Screenshot_2024-03-03_230439_papqbj.png)

#### My Auction Detail / Create Auction

Halaman ini untuk mendaftarkan barang yang ingin dilelang. user perlu mengisi data barang lelang.
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709485694/Screenshot_2024-03-03_183935_yldkcs.png)

#### Orders

Halaman ini untuk menampilkan pesanan dari pembeli yang sudah bayar. User juga dapat mengupadate status pesanan yang sudah diproses.
![App Screenshot](https://res.cloudinary.com/dwyzuwtel/image/upload/v1709488261/Screenshot_2024-03-03_194426_wpqhos.png)
