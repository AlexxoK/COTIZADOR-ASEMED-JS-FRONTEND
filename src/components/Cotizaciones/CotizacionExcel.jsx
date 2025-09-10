import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    }

    const getCentenas = (n) => {
        if (n === 100) return 'CIEN';
        if (n < 100) return getUnidades(n);
        if (n % 100 === 0) return centenas[Math.floor(n / 100)];
        return `${centenas[Math.floor(n / 100)]} ${getUnidades(n % 100)}`;
    }

    if (enteros >= 1000000) {
        const millones = Math.floor(enteros / 1000000);
        res += `${getUnidades(millones)} MILLONES `;
        enteros %= 1000000;
    }

    if (enteros >= 1000) {
        const miles = Math.floor(enteros / 1000);
        res += miles === 1 ? 'MIL ' : `${getCentenas(miles)} MIL `;
        enteros %= 1000;
    }

    if (enteros > 0) res += getCentenas(enteros);

    return `${res.trim()} QUETZALES CON ${decimales.toString().padStart(2, '0')}/100`;
}

export const generarExcelCotizacion = (cotizacion) => {
    const wb = XLSX.utils.book_new();

    const data = [
        ['ACCESORIOS, SUMINISTROS Y EQUIPO MÉDICO - ASEMED'],
        [],
        ['CLIENTE:', `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellido}`],
        ['NIT:', cotizacion.cliente.nit || 'C/F'],
        ['CORREO:', cotizacion.cliente.correo || 'N/A'],
        ['TELÉFONO:', cotizacion.cliente.phone || 'N/A'],
        [],
        ['NOTAS:', 'Por medio de la presente tengo el gusto de poderle cotizar los siguientes productos:'],
        [],
        ['CANTIDAD', 'PRODUCTO / DESCRIPCIÓN', 'P/UNITARIO', 'P/TOTAL']
    ]

    cotizacion.productos.forEach(item => {
        data.push([
            item.cantidad,
            item.producto.nombre,
            `Q${item.producto.precio.toFixed(2)}`,
            `Q${(item.producto.precio * item.cantidad).toFixed(2)}`
        ])

        if (item.producto.descripcion) {
            data.push([
                '',
                item.producto.descripcion,
                '',
                ''
            ])
        }
    })

    const totalCotizacion = cotizacion.productos.reduce(
        (acc, { producto, cantidad }) => acc + producto.precio * cantidad,
        0
    )

    data.push([]);
    data.push(['', '', 'GRAN TOTAL:', `Q${totalCotizacion.toFixed(2)}`]);
    data.push([]);
    data.push(['TOTAL EN LETRAS:', numeroALetras(totalCotizacion)]);
    data.push([]);
    data.push(['TÉRMINOS Y CONDICIONES:']);
    const terminos = [
        'Forma de pago: Anticipada con depósito o transferencia',
        'Tiempo de entrega: 1 a 2 días hábiles después de validar pago',
        'Sostenimiento de oferta: 30 días',
        'Imágenes con fines ilustrativos, el producto final puede variar',
        'Productos sujetos a existencia y/o previa venta, precios pueden variar sin previo aviso',
        'Envío a domicilio GRATIS dentro del perímetro de la capital por compras mínimas de Q200.00',
        'Envío al interior se realiza por medio de transportes (cliente cubre costo del envío)'
    ]
    terminos.forEach(line => data.push([line]));
    data.push([]);
    data.push(['------------------------------------------------------------------------------']);
    data.push(['ACCESORIOS, SUMINISTROS Y EQUIPO MÉDICO - ASEMED']);
    data.push(['PBX: 2463-9797 | info@asemedguatemala.com | www.asemedguatemala.com']);
    data.push(['Dirección: 10 calle 6-40 zona 9, Edificio Salucentro, Local No. 3']);
    data.push(['NIT: 4413193-3']);
    data.push(['Régimen tributario: Sujeto a pagos trimestrales']);

    const ws = XLSX.utils.aoa_to_sheet(data);

    const wscols = [
        { wpx: 70 },
        { wpx: 300 },
        { wpx: 100 },
        { wpx: 100 }
    ]
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, 'Cotización');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `Cotizacion_${cotizacion.cliente.nombre}.xlsx`);
}
