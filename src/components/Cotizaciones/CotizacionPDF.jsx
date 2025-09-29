import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 20, fontFamily: 'Helvetica', fontSize: 8, color: '#000' },
    header: { marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    logo: { width: 120, height: 40 },
    address: { textAlign: 'right', fontSize: 7, color: '#000' },
    clientInfo: { marginBottom: 10, borderBottom: '1px solid #ccc', paddingBottom: 5 },
    infoRow: { flexDirection: 'row', marginBottom: 3 },
    infoLabel: { fontWeight: 'bold', width: 50, color: '#1e293b' },
    infoValue: { flex: 1, color: '#000' },

    table: { display: 'table', width: 'auto', marginBottom: 10, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', borderRightWidth: 0, borderBottomWidth: 0 },
    tableRow: { margin: 'auto', flexDirection: 'row' },

    tableColHeaderCantidad: { width: '10%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', backgroundColor: '#f2f2f2', padding: 3, textAlign: 'center', fontWeight: 'bold' },
    tableColHeaderDescription: { width: '45%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', backgroundColor: '#f2f2f2', padding: 3, textAlign: 'center', fontWeight: 'bold' },
    tableColHeaderImage: { width: '15%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', backgroundColor: '#f2f2f2', padding: 3, textAlign: 'center', fontWeight: 'bold' },
    tableColHeaderUnitario: { width: '15%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', backgroundColor: '#f2f2f2', padding: 3, textAlign: 'center', fontWeight: 'bold' },
    tableColHeaderTotal: { width: '15%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', backgroundColor: '#f2f2f2', padding: 3, textAlign: 'center', fontWeight: 'bold' },

    tableColCantidad: { width: '10%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', padding: 3, textAlign: 'center' },
    tableColDescription: { width: '45%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', padding: 3, textAlign: 'left' },
    tableColImage: { width: '15%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', padding: 3, textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex' },
    tableColUnitario: { width: '15%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', padding: 3, textAlign: 'center' },
    tableColTotal: { width: '15%', borderStyle: 'solid', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#bfbfbf', padding: 3, textAlign: 'center' },

    totalSection: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
    totalBox: { border: '1px solid #bfbfbf', padding: 5, backgroundColor: '#f2f2f2' },
    totalText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
    totalAmount: { fontSize: 10, fontWeight: 'bold', color: '#d60000' },
    totalInWords: { marginBottom: 10, fontSize: 8, color: '#004aad', fontWeight: 'bold' },

    terms: { marginBottom: 30 },
    termsTitle: { fontWeight: 'bold', marginBottom: 3, fontSize: 8, color: '#d60000' },
    termItem: { marginLeft: 10, marginBottom: 1, fontSize: 7, color: '#000' },

    signatureSection: {
        marginTop: 30,
        alignItems: 'center',
        textAlign: 'center',
    },
    signatureText: {
        fontSize: 10,
        marginBottom: 12,
    },
    signatureTextSmall: {
        fontSize: 9,
    },
    signatureTextBold: {
        fontSize: 10
    },

    footer: { borderTop: '1px solid #ccc', paddingTop: 5, textAlign: 'center', fontSize: 6, marginTop: 'auto', color: '#000' },
    footerText: { marginBottom: 2 },
})

const numeroALetras = (num) => {
    const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    let numStr = num.toFixed(2).split('.');
    let enteros = parseInt(numStr[0]);
    let decimales = parseInt(numStr[1]);
    let res = '';

    if (enteros === 0) return `CERO QUETZALES CON ${decimales.toString().padStart(2, '0')}/100`;

    const getUnidades = (n) => {
        if (n < 10) return unidades[n];
        if (n === 10) return 'DIEZ';
        if (n === 11) return 'ONCE';
        if (n === 12) return 'DOCE';
        if (n === 13) return 'TRECE';
        if (n === 14) return 'CATORCE';
        if (n === 15) return 'QUINCE';
        if (n > 15 && n < 20) return `DIECI${unidades[n % 10]}`;
        if (n % 10 === 0) return decenas[Math.floor(n / 10)];
        return `${decenas[Math.floor(n / 10)]} Y ${unidades[n % 10]}`;
    };

    const getCentenas = (n) => {
        if (n === 100) return 'CIEN';
        if (n < 100) return getUnidades(n);
        if (n % 100 === 0) return centenas[Math.floor(n / 100)];
        return `${centenas[Math.floor(n / 100)]} ${getUnidades(n % 100)}`;
    };

    if (enteros >= 1000000) {
        const millones = Math.floor(enteros / 1000000);
        res += `${getUnidades(millones)} MILLONES `;
        enteros %= 1000000;
    }

    if (enteros >= 1000) {
        const miles = Math.floor(enteros / 1000);
        if (miles === 1) res += 'MIL ';
        else res += `${getCentenas(miles)} MIL `;
        enteros %= 1000;
    }

    if (enteros > 0) res += getCentenas(enteros);

    return `${res.trim()} QUETZALES CON ${decimales.toString().padStart(2, '0')}/100`;
}

const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

const CotizacionPDF = ({ cotizacion }) => {
    const today = new Date().toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const totalCotizacion = cotizacion.productos.reduce(
        (acc, { producto, cantidad }) => acc + producto.precio * cantidad,
        0
    )

    const productosPorPagina = chunkArray(cotizacion.productos, 10);

    return (
        <Document>
            {productosPorPagina.map((productosChunk, pageIndex) => (
                <Page key={pageIndex} size="LETTER" style={styles.page}>
                    <View style={styles.header}>
                        <Image src="/images/logo-asemed-guatemala.jpg" style={styles.logo} />
                        <View style={styles.address}>
                            <Text>Guatemala, {today}</Text>
                        </View>
                    </View>

                    {pageIndex === 0 && (
                        <View style={styles.clientInfo}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Señores:</Text>
                                <Text style={styles.infoValue}>{cotizacion.cliente.nombre} {cotizacion.cliente.apellido}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>NIT:</Text>
                                <Text style={styles.infoValue}>{cotizacion.cliente.nit || 'C/F'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Correo:</Text>
                                <Text style={styles.infoValue}>{cotizacion.cliente.correo || 'N/A'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Teléfono:</Text>
                                <Text style={styles.infoValue}>{cotizacion.cliente.phone || 'N/A'}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Notas:</Text>
                                <Text style={styles.infoValue}>
                                    Por medio de la presente tengo el gusto de poderle cotizar el siguiente producto:
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableColHeaderCantidad}>CANTIDAD</Text>
                            <Text style={styles.tableColHeaderDescription}>PRODUCTO</Text>
                            <Text style={styles.tableColHeaderImage}>IMAGEN</Text>
                            <Text style={styles.tableColHeaderUnitario}>P/UNITARIO</Text>
                            <Text style={styles.tableColHeaderTotal}>P/TOTAL</Text>
                        </View>

                        {productosChunk.map((item, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.tableColCantidad}>{item.cantidad}</Text>
                                <View style={styles.tableColDescription}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.producto.nombre}</Text>
                                    {item.producto.descripcion && (
                                        <Text style={{ fontSize: 6, color: '#555', marginTop: 2 }}>
                                            {item.producto.descripcion}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.tableColImage}>
                                    {item.producto.imagen && (
                                        <Image
                                            src={`https://cotizador-asemed-js.vercel.app/cotizador/v1/images/proxy-image?url=${encodeURIComponent(item.producto.imagen)}`}
                                            style={{ width: 50, height: 50, objectFit: 'contain' }}
                                        />
                                    )}
                                </View>
                                <Text style={styles.tableColUnitario}>Q{item.producto.precio.toFixed(2)}</Text>
                                <Text style={styles.tableColTotal}>Q{(item.producto.precio * item.cantidad).toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    {pageIndex === productosPorPagina.length - 1 && (
                        <View wrap={false} style={{ break: 'avoid' }}>
                            <View style={styles.totalSection}>
                                <View style={styles.totalBox}>
                                    <Text style={styles.totalText}>
                                        GRAN TOTAL: <Text style={styles.totalAmount}>Q. {totalCotizacion.toFixed(2)}</Text>
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.totalInWords}>
                                TOTAL EN LETRAS: {numeroALetras(totalCotizacion).toUpperCase()}
                            </Text>

                            <View style={styles.terms}>
                                <Text style={styles.termsTitle}>TÉRMINOS Y CONDICIONES:</Text>
                                <Text style={styles.termItem}>• Forma de pago: Anticipada con depósito o transferencia</Text>
                                <Text style={styles.termItem}>• Tiempo de entrega: 1 a 2 días hábiles después de validar pago</Text>
                                <Text style={styles.termItem}>• Sostenimiento de oferta: 30 días</Text>
                                <Text style={styles.termItem}>• Imágenes con fines ilustrativos, el producto final puede variar</Text>
                                <Text style={styles.termItem}>• Productos sujetos a existencia y/o previa venta, precios pueden variar sin previo aviso</Text>
                                <Text style={styles.termItem}>• Envío a domicilio GRATIS dentro del perímetro de la capital por compras mínimas de Q200.00</Text>
                                <Text style={styles.termItem}>• Envío al interior se realiza por medio de transporte (cliente cubre costo del envío)</Text>
                            </View>

                            <View style={styles.signatureSection}>
                                <Text style={styles.signatureText}>Atentamente</Text>
                                <Text style={styles.signatureTextSmall}>{"\n\n"}Departamento de ventas</Text>
                                <Text style={styles.signatureTextBold}>ASEMED</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>Accesorios, Suministros y Equipo Médico - ASEMED</Text>
                        <Text style={styles.footerText}>PBX: 2463-9797 | info@asemedguatemala.com | www.asemedguatemala.com</Text>
                        <Text style={styles.footerText}>Dirección: 10 calle 6-40 zona 9, Edificio Salucentro, Local No. 3</Text>
                        <Text style={styles.footerText}>NIT: 4413193-3</Text>
                        <Text style={styles.footerText}>Régimen tributario: Sujeto a pagos trimestrales</Text>
                    </View>
                </Page>
            ))}
        </Document>
    )
}

export default CotizacionPDF;
