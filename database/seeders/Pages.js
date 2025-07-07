"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pages_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Pages"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const AttachmentLite_1 = global[Symbol.for('ioc.use')]("Adonis/Addons/AttachmentLite");
class default_1 extends Seeder_1.default {
    async run() {
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=0');
        await Pages_1.default.createMany([
            {
                slug: 'sejarah',
                title: 'Sejarah',
                subtitle: 'Membangun Jembatan Waktu, Mengupas Sejarah Kabupaten Purwakarta',
                thumbnail: null,
                content: '<h2>Sindangkasih, Cikal-Bakal Purwakarta</h2><p>Secara faktual, sejarah Purwakarta berasal dari perpindahan ibu kota Kabupaten Karawang dari Wanayasa ke daerah Sindangkasih. Peristiwa itu terjadi karena Bupati Karawang, R.A. Suriawinata alias "<em>Dalem Sholawat</em>" (1829-1849) menganggap Sindangkasih lebih memadai sebagai ibu kota kabupaten.</p><p>Sindangkasih mulai dibangun menjadi ibu kota baru Kabupaten Karawang diperkirakan sekitar awal tahun 1830. Sarana dan fasilitas kota yang dibangun pada tahap awal adalah Pendopo, Alun-alun, Masjid Agung, dan Situ Buleud. Lebih kurang satu tahun kemudian, kehidupan di Sindangkasih sudah cukup ramai, aman dan tentram. Rupanya kondisi itu mendorong timbulnya gagasan bupati untuk memberi nama kota baru, Purwakarta. Gagasan itu disampaikan oleh Asisten Residen Karawang, G. De Serier kepada Gubernur Jendral J van den Bosch dan disetujui.</p><p>Berdasarkan besluit Gubernur Jendral tanggal 20 Juli 1831 No. 2, Purwakarta diresmikan menjadi ibu kota (baru) Kabupaten Karawang. Namun demikian, nama Sindangkasih tetap digunakan sebagai nama distrik yang wilayahnya mencakup Purwakarta.</p><h2>Purwakarta Ibu Kota Kabupaten Karawang</h2><p>Purwakarta menjadi ibu kota Kabupaten Karawang dari pertengahan tahun 1831-1950 yang berarti mencakup tiga zaman, yaitu zaman penjajahan Belanda, zaman pendudukan Jepang, dan zaman revolusi kemerdekaan.</p><p>Pada zaman penjajahan Belanda (1831-1942), kota Purwakarta menjadi tempat kedudukan 7 orang Bupati Karawang secara berturut-turut. Dalam perkembangannya, tahun 1845 Purwakarta menjadi ibu kota Keresidenan Karawang. Sejak saat itu Purwakarta semakin berkembang, berjalan dengan kebijakan Bupati dan Presiden. Di pusat kota dibangun kantor asisten residen, jalan, penjara, dan pasar. Jumlah penduduk bertambah dan menjadi heterogen dengan keberadaan sejumlah orang Belanda, Cina, dan Arab.</p><p>Pada masa kepemimpinan Bupati R.A.A. Sastra Adiningrat II (1863-1886), Purwakarta semakin maju. Atas keberhasilan memajukan daerahnya, bupati mendapat tanda jasa berupa bintang "<em>Rider in de Orde van den Leeuw</em>" sehingga ia dijuluki "<em>Dalem Bintang</em>".</p><p>Akibat perubahan kebijakan pihak kolonial dalam bidang politik dan pemerintahan, Purwakarta - selain sebagai ibu kota kabupaten dan keresidenan memiliki kedudukan yang berubah-ubah. Tahun 1860-an, Purwakarta menjadi <em>afdeling</em>, kemudian berubah menjadi <em>contro afdeling</em> sejak tahun 1871 dan wilayahnya bertambah luas. Tahun 1830-an <em>controle afdeling</em> dihapuskan dan Purwakarta kembali menjadi <em>afdeling</em>, terdiri atas 3 distrik (Sindangkasih, Wanayasa dan Gandasoli) meliputi 10 kecamatan mencakup sejumlah desa. Kemudian Purwakarta menjadi kecamatan Distrik Sindangkasih.</p><p>Sejak awal abad ke-20, Purwakarta semakin berkembang setelah daerah itu dilewati oleh jalan kereta api dari Batavia ke Padalarang, akan tetapi sejak tahun 1922 Purwakarta tidak lagi menjadi ibu kota Keresidenan Karawang, karena Karawang dimasukkan ke dalam wilayah Keresidenan Batavia. Kondisi itu berlangsung sampai akhir pemerintahan Hindia-Belanda (awal tahun 1942).</p><p>Pada zaman pendudukan Jepang (1942-1945), Purwakarta hanya berkedudukan sebagai ibu kota Kabupaten Karawang, dipimpin oleh Bupati (Kenco) R.T. Pandu Suriadiningrat. Bekas kantor asisten residen di Purwakarta menjadi markas polisi (<em>Honbu Kenpetai</em>) Jepang. Seperti daerah-daerah lain, di Purwakarta-pun pemerintah militer Jepang membentuk berbagai organisasi pemuda, yaitu <em>Sienendan</em>, <em>Kebodan</em>, <em>Heiho</em>, Peta (Pembela Tanah Air), Barisan Pelopor dan <em>Fujinkai</em> (Barisan Wanita) bahkan Purwakarta menjadi tempat latihan khusus anggota Peta di daerah Karawang.</p><p>Zaman revolusi kemerdekaan, Purwakarta menjadi daerah perjuangan dalam upaya mengusir tentara Jepang dan menghadapi sekutu dan Belanda/NICA (<em>Netherlands Indie Civil Administration</em>) yang mengambil alih kekuasaan Jepang.</p><p>Di peristiwa-peristiwa penting, baik di Purwakarta untuk mempertahankan kemerdekaan makin meningkat setelah di kota itu berdiri KNID (Komite Nasional Indonesia Daerah) dan BKR (Badan Keuangan Rakyat), kemudian markas TKR (Tentara Keamanan Rakyat) komandemen 1 Jawa Barat, dalam gejolak perjuangan itu, pemerintahan Keresidenan Jakarta dipindahkan ke Purwakarta, akibat situasi Jakarta yang semakin kacau.</p><p>Ketika pemerintah pendudukan Belanda yang menggantikan kekuasaan sekutu berhasil membentuk RIS (Republik Indonesia Serikat), terdiri atas negara-negara federal, antara lain Negara Pasundan, Purwakarta masuk ke dalam kekuasaan Negara Pasundan (1948-1950). Hal itu berlangsung sampai RIS dibubarkan dan Indonesia kembali menjadi negara kesatuan (sejak 17 Agustus 1950).</p><h2>Purwakarta Menjadi Kabupaten</h2><p>Purwakarta pertama kali menjadi kabupaten dibentuk menjadi Wali Negara Pasundan (SK No. 12 tanggal 29 Januari 1949). SK itu menyatakan bahwa daerah Karawang Timur menjadi Kabupaten Purwakarta dengan ibu kota di Subang, diperintah oleh Bupati R.M. Hasan Suria Sacakusumah, sedangkan Karawang Barat menjadi Kabupaten Karawang.</p><p>Setelah Negara Pasundan dibubarkan (11 Maret 1950), Pemerintah RI membenahi wilayah administratif. Berdasarkan Undang-Undang No. 14 Tahun 1950 (18 Agustus 1950), Purwakarta ditetapkan sebagai Kabupaten dengan ibu kota di Subang, diperintah oleh R.P. Suyono Hadi Pranoto (1950-1958). Wilayahnya terdiri atas 5 kewedaan (Purwakarta, Subang, Pamanukan, Ciasem dan Sagalaherang).</p><p>Awal Desember 1953, sejumlah tokoh Purwakarta memohon kepada pemerintah pusat agar ibu kota Kabupaten Purwakarta dipindahkan dari Subang ke Purwakarta, karena kondisi dan potensi Purwakarta lebih memadai sebagai ibu kota Kabupaten. Permohonan itu terkatung-katung dalam waktu yang cukup lama, karena terhambat oleh berbagai masalah. Tahun 1963 permohonan tersebut berubah menjadi keinginan untuk membentuk Kabupaten Purwakarta baru dengan ibu kota.</p><p>Untuk mengisi kekosongan jabatan kepada daerah Kabupaten Purwakarta, R.H. Sunarya Ronggowaluyo ditetapkan menjadi pejabat Bupati Kabupaten Purwakarta. S. Syam dan Moh. Husein Syabih masing-masing ditetapkan menjadi ketua dan wakil ketua DPRD-GR Purwakarta dengan Ibu Kota Purwakarta. Dua minggu kemudian (12 Juli 1968), Menteri Dalam Negeri Letnan Jendral Basuki Rahmat meresmikan berdirinya Kabupaten Purwakarta dengan ibu kota Purwakarta, sekaligus melantik R.H. Sunarya Ronggowaluyo menjadi Bupati Purwakarta.</p><p>Sejak Tahun 1968 sampai sekarang, Kota Purwakarta menjadi pusat pemerintahan Kabupaten Purwakarta. Dan mulai sekarang (tahun 2008), diperingati berdirinya Kabupaten Purwakarta.</p><h2>Hari Jadi Purwakarta</h2><p>Sampai dengan penelitian dan penulisan sejarah Purwakarta berlangsung (tahun 2003), bahkan hingga sekarang, terdapat 3 versi tentang hari jadi Kota Purwakarta yaitu tanggal 23 Agustus 1830, tanggal 27 Juni 1836, dan tanggal 7 Mei 1830. Berdasarkan aspirasi masyarakat melalui DPRD Kabupaten Purwakarta yang selanjutnya disampaikan kepada Bupati Purwakarta.</p><p>Sebagai tindak lanjut aspirasi tersebut Bupati Purwakarta mengeluarkan keputusan Bupati Purwakarta No 433.05/Kep.239-Diparda/2003, tentang pembentukan tim penelusuran sejarah Kabupaten Purwakarta, yang dikeluarkan di Purwakarta pada 31 Maret 2003 atas dasar itu, tim penelusuran sejarah Purwakarta berupaya mengkaji ketiga versi terebut dengan menggunakan metodologi sejarah. Berdasarkan penelitian yang dilaksanakan oleh tim penelusuran sejarah Purwakarta, ditemukan hal-hal sebagai berikut:</p><p><strong>Pertama</strong>: Tanggal pada masing-masing versi yang telah disebutkan, tidak diperoleh dari sumber akurat yang mengandung fakta sejarah. Tidak ditemukan sumber sejarah yang menunjukkan secara tersurat atau tersirat salah satu dari tanggal tersebut adalah tanggal berdirinya Kota Purwakarta.</p><p><strong>Kedua</strong>: Oleh karena "Peletakan Batu Pertama" pembangunan kota yang kemudian bernama Purwakarta tidak/belum ditemukan, boleh jadi momentum itu tidak tercatat dalam dokumen maka atas dasar besluit Gubernur Jendral tanggal 20 Juli 1831 tetap untuk dipilih dan ditetapkan sebagai hari jadi Kota Purwakarta. Ketetapan ini berlaku selama tidak ditemukan sumber akurat yang menyatakan secara eksplisit tanggal dimulainya pembangunan Sindangkasih menjadi Kota Purwakarta.</p><p>Pertimbangan/alasan memilih 20 Juli 1821 sebagai hari jadi kota Purwakarta adalah:</p><ul><li>Tanggal ini adalah tanggal besluit (surat keputusan) peresmian Purwakarta menjadi nama kota yang dibangun oleh Bupati R.A. Suriawinata ("<em>Dalem Sholawat</em>")</li><li>Besluit (surat keputusan) adalah sumber primer yang keabsahannya dapat dipertanggungjawabkan secara ilmiah.</li><li>Beberapa waktu yang lalu, DPRD Kabupaten Purwakarta memang telah menetapkan tanggal 23 Agustus 1830 (versi pertama) sebagai hari jadi Kabupaten Purwakarta, tetapi ketetapan itu disertai catatan, bahwa tidak menutup kemungkinan adanya koreksi, apabila ditemukan fakta lain yang lebih kuat. Sekarang fakta itu telah ditemukan.</li></ul><p>Berdasarkan temuan tim penelusuran sejarah Purwakarta tersebut, maka tanggal 20 Juli 1831 ditetapkan sebagai hari jadi Kabupaten Purwakarta, yang dilandasi dengan Peraturan Daerah No. 2 Tahun 2006 tentang hari jadi Purwakarta. Ditetapkan di Purwakarta tanggal 3 Juni 2006.</p>',
                type: 'html',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                slug: 'lambang-identitas',
                title: 'Lambang & Identitas',
                subtitle: 'Menyelami Lambang dan Identitas Visual Kabupaten Purwakarta',
                thumbnail: null,
                content: JSON.stringify({
                    pre: '<p>Lambang Purwakarta secara keseluruhan mengadopsi bentuk perisai segi lima yang melambangkan tameng Bangsa Indonesia sesuai dengan dasar negara Pancasila. Pada bagian pelat merah di tengah lambang, terdapat tulisan "Wibawa Karta Raharja" yang merupakan semboyan/motto Kabupaten Purwakarta.</p><p>"Wibawa" mewakili kehormatan dan kebesaran, "Karta" mencerminkan kehidupan yang ramai dan "Raharja" menggambarkan keadaan sejahtera dan makmur. Dengan demikian, lambang ini melambangkan Kabupaten Purwakarta sebagai daerah yang memiliki kehormatan, kehidupan yang ramai, serta sejahtera dan makmur.</p>',
                    section: [
                        {
                            title: 'Segi Berwarna Hitam Berplat Merah',
                            caption: 'Dimaksudkan bendungan serba-guna Jatiluhur, yang merupakan kebanggaan dan kemakmuran rakyat.',
                        },
                        {
                            title: 'Lengkung Berwarna Hijau Gelombang Putih dan Biru',
                            caption: 'Dimaksudkan Situ Buleud.',
                        },
                        {
                            title: 'Rumah Berwarna Merah dan Kuning',
                            caption: 'Menggambarkan Gedung Kresidenan yang bersejarah, keagungan daerah Purwakarta, atapnya berbentuk gunung Tangkuban Perahu, dihubungkan dengan legenda rakyat, mengenai bendungan sungai, cerita Sangkuriang.',
                        },
                        {
                            title: 'Padi dan Kapas',
                            caption: 'Merupakan lambang kemakmuran yang tidak bisa terpisahkan, sesuai pula dengan penghidupan rakyat Kabupaten Purwakarta yang sebagian besar hidup dari pertanian.',
                        },
                    ],
                    color: [
                        {
                            hex: '#00a859',
                            name: 'Hijau Muda',
                            caption: 'Harapan bagi masa depan daerah Purwakarta untuk terus membangun suatu daerah yang adil, makmur dan sejahtera.',
                        },
                        { hex: '#201e1e', name: 'Hitam', caption: 'Ketuhanan dan ketekunan hati.' },
                        { hex: '#fff212', name: 'Kuning', caption: 'Keagungan/kebesaran daerah.' },
                        {
                            hex: '#ed3237',
                            name: 'Merah',
                            caption: 'Tekad perjuangan bangsa yang pantang mundur, rela bermandi darah daripada menyerah.',
                        },
                    ],
                }),
                type: 'json',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                slug: 'visi-misi',
                title: 'Visi dan Misi',
                subtitle: 'Mengenal Visi dan Misi Kabupaten Purwakarta',
                thumbnail: null,
                content: JSON.stringify({
                    vision: {
                        title: 'Mewujudkan Purwakarta Istimewa',
                        subtitle: 'Menuju Purwakarta Istimewa melalui peningkatan pendidikan, kesehatan, dan kesejahteraan sosial, tata kelola pemerintahan yang baik, pembangunan infrastruktur berwawasan lingkungan, dan perekonomian rakyat berbasis desa yang kokoh dan inklusif',
                    },
                    mission: [
                        {
                            title: 'Meningkatkan Kualitas Pendidikan, Kesehatan, dan Kesejahteraan Sosial',
                            subtitle: 'Melakukan peningkatan sektor pendidikan, kesehatan, dan kesejahteraan masyarakat untuk mencapai taraf hidup yang lebih baik dan berkualitas',
                        },
                        {
                            title: 'Meningkatkan Tata Kelola Pemerintahan Yang Baik, Bersih dan Profesional',
                            subtitle: 'Memperkuat tata kelola pemerintahan agar memberikan pelayanan publik yang efisien, adil, dan transparan kepada seluruh masyarakat',
                        },
                        {
                            title: 'Mewujudkan Pembangunan Infrastruktur dan Pengembangan Pariwisata Berwawasan Lingkungan yang Berkelanjutan',
                            subtitle: 'Menyelenggarakan pembangunan infrastruktur dengan berwawasan lingkungan serta pengembangan sektor pariwisata yang berkelanjutan untuk mendukung pertumbuhan ekonomi daerah',
                        },
                        {
                            title: 'Mewujudkan Perekonomian Rakyat Yang Kokoh Berbasis Desa',
                            subtitle: 'Menggalakkan perekonomian rakyat di tingkat desa dengan memberdayakan masyarakat melalui program-program ekonomi yang berkelanjutan dan inklusif',
                        },
                    ],
                }),
                type: 'json',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                slug: 'tugas-fungsi',
                title: 'Tugas & Fungsi',
                subtitle: 'Meninjau Tugas dan Fungsi Dinas Kabupaten Purwakarta',
                thumbnail: null,
                content: JSON.stringify({
                    content: '<h2>Tugas dan Fungsi Dinas</h2><p>Dinas mempunyai tugas membantu Bupati melaksanakan Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil yang menjadi kewenangan Daerah, dan tugas pembantuan yang diberikan kepada Daerah.</p><ol><li>Perumusan kebijakan, program, dan kegiatan Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil;</li><li>Pelaksanaan kebijakan, program, dan kegiatan Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil;</li><li>Pelaksanaan evaluasi dan pelaporan penyelenggaraan Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil;</li><li>Pelaksanaan administrasi Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil; dan</li><li>Pelaksanaan fungsi lain yang diberikan oleh Bupati sesuai lingkup tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Kepala Dinas</h2><p>Kepala Dinas mempunyai tugas memimpin, mengkoordinasikan dan mengendalikan Dinas dalam melaksanakan Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil yang menjadi kewenangan Daerah dan tugas pembantuan yang diberikan kepada Daerah.</p><ol><li>Perumusan dan penetapan kebijakan, program, dan kegiatan Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil;</li><li>Penyelenggaraan <span style="color: rgb(107, 114, 128);">Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil;</span></li><li><span style="color: rgb(107, 114, 128);">Pembinaan dan pelaksanaan tugas Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil;</span></li><li><span style="color: rgb(107, 114, 128);">Pemantauan, evaluasi, dan pelaporan atas penyelenggaraan Urusan Pemerintahan bidang Kependudukan dan Pencatatan Sipil;</span></li><li><span style="color: rgb(107, 114, 128);">Pembinaan ketatausahaan Dinas; dan</span></li><li>Pelaksanaan tugas lain yang diberikan oleh Bupati sesuai lingkup tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Sekretariat</h2><p>Sekretariat dipimpin oleh seorang Sekretaris yang berada dibawah dan bertanggung jawab kepada Kepala Dinas. Sekretaris mempunyai tugas membantu Kepala Dinas dalam memimpin dan mengkoordinasikan penyelenggaraan urusan kesekretariatan yang meliputi perencanaan dan pelaporan, keuangan, serta kepegawaian dan administrasi umum.</p><ol><li>Pengkoordinasian penyusunan dokumen perencanaan dan pelaporan dinas;</li><li>Pelaksanaan manajemen dan administrasi keuangan Dinas;</li><li>Pelaksanaan manajemen dan administrasi kepegawaian;</li><li>Pelaksanaan administrasi dokumen dinas dan kearsipan;</li><li>Pengelolaan sarana dan prasarana kerja Dinas; dan</li><li>Pelaksanaan tugas lain yang diberikan Kepala Dinas sesuai dengan tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Subbagian Keuangan</h2><p>Subbagian Keuangan dipimpin oleh seorang Kepala Subbagian yang berada dibawah dan bertanggung jawab kepada Sekretaris. Kepala Subbagian Keuangan mempunyai tugas melaksanakan penatausahaan keunagan Dinas.</p><ol><li>Pengelolaan dan penatausahaan keuangan Dinas;</li><li>Pelaksanaan koordinasi kegiatan administrasi keuangan Dinas;</li><li>Pelaksanaan penatausahaan keuangan, yang meliputi penganggaran, perbendaharaan, dan akunting; dan</li><li>Pelaksanaan tugas lain yang diberikan oleh Sekretaris, sesuai dengan tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Subbagian Kepegawaian dan Umum</h2><p>Subbagian Kepegawaian dan Umum dipimpin oleh seorang Kepala Subbagian yang berada dibawah dan bertanggung jawab kepada Sekretaris. Kepala Subbagian Kepegawaian dan Umum mempunyai tugas menyelenggarakan manajemen kepegawaian, mengelola sarana dan prasarana kerja, mengelola administrasi dokumen Dinas, dan kearsipan.</p><ol><li>Penyelenggaraan manajemen kepegawaian;</li><li>Pengelolaan sarana dan prasarana kerja Dinas;</li><li>Pengelolaan administrasi dokumen dinas, dan kearsipan; dan</li><li>Pelaksanaan tugas lain yang diberikan oleh Sekretaris sesuai lingkup tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Bidang Pelayanan Pendaftaran Penduduk</h2><p>Bidang Pelayanan Pendaftaran Penduduk dipimpin oleh seorang kepala bidang yang berada dibawah dan bertanggung jawab kepada Kepala Dinas. Kepala Bidang Pelayanan Pendaftaran Penduduk mempunyai tugas melaksanakan pengelolaan urusan pemerintah daerah dibidang pelayanan pendaftaran penduduk.</p><ol><li>Perumusan kebijakan teknis dibidang pelayanan pendaftaran penduduk;</li><li>Pengelolaan urusan pemerintahan dan pelayanan umum dibidang pendaftaran penduduk;</li><li>Pembinaan, pengawasan dan pengendalian pelaksanaan tugas bidang pelayanan pendaftaran penduduk dan administrasi penduduk pindah datang; dan</li><li>Pelaksanaan tugas lain yang diberikan Kepala Dinas sesuai dengan tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Bidang Pelayanan Pencatatan Sipil</h2><p>Bidang Pelayanan Pencatatan Sipil dipimipin oleh seorang kepala bidang yang berada dibawah dan bertanggung jawab kepada Kepala Dinas. Kepala Bidang Pelayanan Pencatatan Sipil mempunyai tugas melaksanakan pengelolaan urusan pemerintah daerah dibidang pencatatan sipil.</p><ol><li>Perumusan kebijakan teknis dibidang Pelayanan pencatatan sipil;</li><li>Pengelolaan urusan pemerintahan dan pelayanan umum dibidang pencatatan sipil</li><li>Pembinaan, pengawasan dan pengendalian pelaksanaan tugas bidang kelahiran dan kematian, perkawinan, perceraian, dan pengesahan pengangkatan anak; dan</li><li>Pelaksanaan tugas lain yang diberikan Kepala Dinas sesuai dengan tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Bidang Pengelolaan Informasi Administrasi Kependudukan</h2><p>Bidang Pengelolaan Informasi Administrasi Kependudukan dipimpin oleh seorang kepala bidang yang berada dibawah dan bertanggung jawab kepada Kepala Dinas. Kepala <span style="color: rgb(107, 114, 128);">Bidang Pengelolaan Informasi Administrasi Kependudukan mempunyai tugas melaksanakan pengelolaan urusan pemerintah daerah dibidang pengelolaan informasi administrasi kependudukan.</span></p><ol><li>Perumusan kebijakan teknis dibidang pengelolaan informasi administrasi kependudukan;</li><li>Pengelolaan urusan pemerintahan dan pelayanan umum dibidang pengelolaan informasi administrasi kependudukan;</li><li>Pembinaan, pengawasan dan pengendalian pelaksanaan tugas bidang pengelolaan informasi administrasi kependudukan; dan</li><li>Pelaksanaan tugas lain yang diberikan Kepala Dinas sesuai dengan tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Bidang Pemanfaatan Data dan Inovasi Pelayanan</h2><p>Bidang Pemanfaatan Data dan Inovasi Pelayanan dipimpin oleh seorang kepala bidang yang berada dibawah dan bertanggung jawab kepada Kepala Dinas. Kepala <span style="color: rgb(107, 114, 128);">Bidang Pemanfaatan Data dan Inovasi Pelayanan mempunyai tugas melaksanakan pengelolaan urusan pemerintah daerah dibidang Pemanfaatan Data dan Inovasi Pelayanan.</span></p><ol><li>Perumusan kebijakan teknis dibidang Pemanfaatan Data dan Inovasi Pelayanan;</li><li>Pengelolaan urusan pemerintahan dan pelayanan umum dibidang pemanfaatan data dan inovasi pelayanan;</li><li>Pembinaan, pengawasan dan pengendalian pelaksanaan tugas bidang pemanfaatan data dan inovasi pelayanan; dan</li><li>Pelaksanaan tugas lain yang diberikan Kepala Dinas sesuai dengan tugas dan fungsinya.</li></ol><h2>Tugas dan Fungsi Sub-Koordinator Jabatan Fungsional</h2><p>Kelompok sub-subtansi merupakan tugas tambahan kepada pejabat fungsional selaku sub-koordinator jabatan fungsional. Sub-koordinator jabatan fungsional melaksanakan fungsi pelayanan fungsional sesuai dengan ruang lingkup bidang tugas dan fungsi Administrator. Sub-koordinator jabatan fungsional ditetapkan oleh Bupati atas usulan Sekretaris Daerah.</p><h2>Tugas dan Fungsi Kelompok Jabatan Fungsional</h2><p>Kelompok Jabatan Fungsional mempunyai tugas melaksanakan sebagaian tugas Dinas secara profesional sesuai dengan tugas jabatannya berdasarkan ketentuan perundang-undangan.</p>',
                    source: 'https://ppid.purwakartakab.go.id/daerah/detail/UmF5c2I5eUw2bHpkM29kMEpoRFJudz09',
                }),
                type: 'json',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                slug: 'bupati',
                title: 'Profil Bupati',
                subtitle: 'Profil Singkat Bupati Kabupaten Purwakarta',
                thumbnail: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'page/clkt3epjv00fu6id6cfck0fme.default.jpeg',
                    extname: 'jpeg',
                    size: 114488,
                    mimeType: 'image/jpeg',
                })),
                content: '<h3>Biodata</h3><ul><li>Nama: Hj. Anne Ratna Mustika, S.E.</li><li>Tempat & Tanggal Lahir: Cianjur, 28 Januari 1982</li><li>Alamat Tempat Tinggal: -</li><li>Jenis Kelamin: Perempuan</li><li>Agama: Islam</li><li>Pekerjaan: Bupati Purwakarta</li></ul><h3>Keluarga</h3><ul><li>Ayah: -</li><li>Ibu: -</li><li>Suami: -</li><li>Anak:</li></ul><ol><li class="ql-indent-1">Yudistira M. Rahmaning H.</li><li class="ql-indent-1">Hyang Sukma Ayu Mulyadi</li></ol><h3>Riwayat Pendidikan</h3><ol><li>SDN Gudang 2</li><li>SMPN 1 Cikalong Kulon, Kabupaten Cianjur</li><li>SMAN 1 Cikalong Kulon, Kabupaten Cianjur</li><li>Sekolah Tinggi Ilmu Ekonomi WIKARA, Kabupaten Purwakarta</li></ol><h3>Riwayat Organisasi</h3><ol><li>Ketua TP PKK Kabupaten Purwakarta periode 2008-2018</li><li>Ketua Persatuan Wanita Olahraga Indonesia periode 2008-2018</li><li>Ketua Dekranasda Kabupaten Purwakarta periode 2008-2018</li><li>Ketua Kwarcab Pramuka Kabupaten Purwakarta periode 2015-2020</li></ol>',
                type: 'html',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                slug: 'wakil-bupati',
                title: 'Profil Wakil Bupati',
                subtitle: 'Profil Singkat Wakil Bupati Kabupaten Purwakarta',
                thumbnail: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'page/clkt3exdk00g06id63xsah2pc.default.jpeg',
                    extname: 'jpeg',
                    size: 64818,
                    mimeType: 'image/jpeg',
                })),
                content: '<h3>Biodata</h3><ul><li>Nama: H. Aming</li><li>Tempat & Tanggal Lahir: Purwakarta, 10 Juni 1977</li><li>Alamat Tempat Tinggal: -</li><li>Jenis Kelamin: Laki-laki</li><li>Agama: Islam</li><li>Pekerjaan: Wakil Bupati Purwakarta</li></ul><h3>Keluarga</h3><ul><li>Ayah: -</li><li>Ibu: -</li><li>Istri: Entin Suhartini</li><li>Anak:</li></ul><ol><li class="ql-indent-1">Asep Sunanda</li><li class="ql-indent-1">Winda Amelia</li><li class="ql-indent-1">Egi Ade Septiana</li><li class="ql-indent-1">Eky Aditia</li></ol><h3>Riwayat Pendidikan</h3><ol><li>SDN Tajursindang III</li><li>STIE Wibawa Karta Raharja</li></ol><h3>Riwayat Organisasi</h3><ol><li>Ketua RW 001 Desa Tajursindang periode 2000-2007</li><li>Kepala Desa Tajursindang periode 2007-2018</li></ol>',
                type: 'html',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                slug: 'sekretaris-daerah',
                title: 'Profil Sekretaris Daerah',
                subtitle: 'Profil Singkat Sekretaris Daerah Kabupaten Purwakarta',
                thumbnail: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'page/clkt3f2bu00g66id61rnp0ky9.default.jpeg',
                    extname: 'jpeg',
                    size: 53268,
                    mimeType: 'image/jpeg',
                })),
                content: JSON.stringify({
                    name: 'H. Norman Nugraha, S.Si, MM.',
                    content: '<h3>Biodata</h3><ul><li>Nama: H. Norman Nugraha, S.Si, MM.</li><li>Tempat & Tanggal Lahir: Bandung, 17 November 1983</li><li>Alamat Tempat Tinggal: -</li><li>Jenis Kelamin: Laki-laki</li><li>Agama: Islam</li><li>Pekerjaan: Sekretaris Purwakarta</li></ul><h3>Keluarga</h3><ul><li>Ayah: -</li><li>Ibu: -</li><li>Suami: -</li><li>Anak:</li></ul><ol><li class="ql-indent-1">-</li></ol><h3>Riwayat Pendidikan</h3><ol><li>-</li></ol><h3>Riwayat Organisasi</h3><ol><li>-</li></ol>',
                }),
                type: 'json',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
            {
                slug: 'struktur-organisasi',
                title: 'Struktur Organisasi',
                subtitle: 'Lihat Dengan Jelas Bagan Struktur Organisasi Kabupaten Purwakarta',
                thumbnail: AttachmentLite_1.Attachment.fromDbResponse(JSON.stringify({
                    name: 'page/clkuyb4sf00mhm6d6f2pl0r7u.default.png',
                    extname: 'png',
                    size: 53664,
                    mimeType: 'image/png',
                })),
                content: '<p>Berdasarkan Peraturan Bupati Purwakarta No.237 Tahun 2021 tentang Kedudukan Susunan Organisasi, Tugas dan Fungsi Serta Tata Kerja Dinas Kependudukan dan Pencatatan Sipil, Perangkat Daerah adalah unsur pembantu Bupati dan Dewan Perwakilan Rakyat Daerah dalam penyelenggaraan Urusan Pemerintah yang menjadi kewenangan Daerah Kabupaten Purwakarta.</p>',
                type: 'html',
                enhancer: '454342ac-ea26-11ed-8a6a-00155dd467fd',
            },
        ]);
        await Database_1.default.rawQuery('SET FOREIGN_KEY_CHECKS=1');
    }
}
exports.default = default_1;
//# sourceMappingURL=Pages.js.map