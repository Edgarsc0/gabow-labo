function generarSVGConCirculoEnCentro(caracter) {
    const ancho = 10;
    const alto = 10;
    const radio = 5;
    const centroX = ancho / 2;
    const centroY = alto / 2;
    const svg = `
      <svg width="${ancho}" height="${alto}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${centroX}" cy="${centroY}" r="${radio}" fill="blue" />
        <text x="${centroX}" y="${centroY}" font-family="Arial" font-size="10" fill="white" text-anchor="middle" alignment-baseline="central">${caracter}</text>
      </svg>
    `;
    return svg;
};

export {generarSVGConCirculoEnCentro}