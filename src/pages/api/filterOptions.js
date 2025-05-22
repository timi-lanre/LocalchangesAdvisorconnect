import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Fill in your database configuration here
  const connectionConfig = {
    host: 'advisorwebapp.crcke66wq2ed.ca-central-1.rds.amazonaws.com',         // e.g., 'your-database-host'
    port: 3306,       // Default MySQL port is 3306
    user: 'Admin',         // Your MySQL username
    password: '28UKOJi3OshzZT',     // Your MySQL password
    database: 'advisor_dashboard'      // Your database name
  };

  // Extract query parameters (for cascading filters)
  const { province = '', city = '', firm = '', team = '' } = req.query;
  
  // Parse comma-separated values into arrays
  const provinces = province ? province.split(',') : [];
  const cities = city ? city.split(',') : [];
  const firms = firm ? firm.split(',') : [];
  const teams = team ? team.split(',') : [];

  try {
    const conn = await mysql.createConnection(connectionConfig);

    // -------------------------------
    // Province Options (exclude filtering on Province itself)
    // -------------------------------
    let provConditions = "WHERE TRIM(Province) <> ''";
    const provParams = [];
    
    if (cities.length > 0) {
      const placeholders = cities.map(() => '?').join(',');
      provConditions += ` AND TRIM(City) IN (${placeholders})`;
      provParams.push(...cities);
    }
    
    if (firms.length > 0) {
      const placeholders = firms.map(() => '?').join(',');
      provConditions += ` AND TRIM(Firm) IN (${placeholders})`;
      provParams.push(...firms);
    }
    
    if (teams.length > 0) {
      const placeholders = teams.map(() => '?').join(',');
      provConditions += ` AND TRIM(\`Team Name\`) IN (${placeholders})`;
      provParams.push(...teams);
    }

    const [provRows] = await conn.query(
      `
      SELECT DISTINCT TRIM(Province) AS val
      FROM \`data\`
      ${provConditions}
      ORDER BY val
      `,
      provParams
    );

    // -------------------------------
    // City Options (filter by Province, Firm, Team if provided)
    // -------------------------------
    let cityConditions = "WHERE TRIM(City) <> ''";
    const cityParams = [];
    
    if (provinces.length > 0) {
      const placeholders = provinces.map(() => '?').join(',');
      cityConditions += ` AND TRIM(Province) IN (${placeholders})`;
      cityParams.push(...provinces);
    }
    
    if (firms.length > 0) {
      const placeholders = firms.map(() => '?').join(',');
      cityConditions += ` AND TRIM(Firm) IN (${placeholders})`;
      cityParams.push(...firms);
    }
    
    if (teams.length > 0) {
      const placeholders = teams.map(() => '?').join(',');
      cityConditions += ` AND TRIM(\`Team Name\`) IN (${placeholders})`;
      cityParams.push(...teams);
    }

    const [cityRows] = await conn.query(
      `
      SELECT DISTINCT TRIM(City) AS val
      FROM \`data\`
      ${cityConditions}
      ORDER BY val
      `,
      cityParams
    );

    // -------------------------------
    // Firm Options (filter by Province, City, Team)
    // -------------------------------
    let firmConditions = "WHERE TRIM(Firm) <> ''";
    const firmParams = [];
    
    if (provinces.length > 0) {
      const placeholders = provinces.map(() => '?').join(',');
      firmConditions += ` AND TRIM(Province) IN (${placeholders})`;
      firmParams.push(...provinces);
    }
    
    if (cities.length > 0) {
      const placeholders = cities.map(() => '?').join(',');
      firmConditions += ` AND TRIM(City) IN (${placeholders})`;
      firmParams.push(...cities);
    }
    
    if (teams.length > 0) {
      const placeholders = teams.map(() => '?').join(',');
      firmConditions += ` AND TRIM(\`Team Name\`) IN (${placeholders})`;
      firmParams.push(...teams);
    }

    const [firmRows] = await conn.query(
      `
      SELECT DISTINCT TRIM(Firm) AS val
      FROM \`data\`
      ${firmConditions}
      ORDER BY val
      `,
      firmParams
    );

    // -------------------------------
    // Team Options (filter by Province, City, Firm)
    // -------------------------------
    let teamConditions = "WHERE TRIM(`Team Name`) <> ''";
    const teamParams = [];
    
    if (provinces.length > 0) {
      const placeholders = provinces.map(() => '?').join(',');
      teamConditions += ` AND TRIM(Province) IN (${placeholders})`;
      teamParams.push(...provinces);
    }
    
    if (cities.length > 0) {
      const placeholders = cities.map(() => '?').join(',');
      teamConditions += ` AND TRIM(City) IN (${placeholders})`;
      teamParams.push(...cities);
    }
    
    if (firms.length > 0) {
      const placeholders = firms.map(() => '?').join(',');
      teamConditions += ` AND TRIM(Firm) IN (${placeholders})`;
      teamParams.push(...firms);
    }
    
    const [teamRows] = await conn.query(
      `
      SELECT DISTINCT TRIM(\`Team Name\`) AS val
      FROM \`data\`
      ${teamConditions}
      ORDER BY val
      `,
      teamParams
    );

    await conn.end();

    // Using Set to ensure uniqueness
    const uniqueProvinces = [...new Set(provRows.map(r => r.val).filter(Boolean))];
    const uniqueCities = [...new Set(cityRows.map(r => r.val).filter(Boolean))];
    const uniqueFirms = [...new Set(firmRows.map(r => r.val).filter(Boolean))];
    const uniqueTeams = [...new Set(teamRows.map(r => r.val).filter(Boolean))];

    // Log the response for debugging
    console.log("API /filterOptions response:", {
      provinces: uniqueProvinces.length,
      cities: uniqueCities.length,
      firms: uniqueFirms.length,
      teams: uniqueTeams.length
    });

    res.status(200).json({ 
      provinces: uniqueProvinces, 
      cities: uniqueCities, 
      firms: uniqueFirms, 
      teams: uniqueTeams 
    });
  } catch (err) {
    console.error("API /filterOptions error:", err);
    res.status(500).json({ error: err.message });
  }
}