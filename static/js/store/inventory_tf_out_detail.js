const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// Pengkondisian ketika klik button Received
document.getElementById("sentButton").addEventListener("click", function() {
    // Menampilkan SweetAlert konfirmasi
    Swal.fire({
        title: 'Sent Transfer Out?',
        text: "Apakah kamu yakin akan sent transfer out?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, yakin!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Jika pengguna menekan tombol "OK", arahkan ke halaman yang sesuai
            window.location.href = `inventory_tf_out_sent.html?id=${id}`;
        }
    });
});