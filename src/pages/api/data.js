// src/pages/api/data.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Destructure query params, defaulting as needed
  const {
    page = '1',
    limit = '100',
    sortBy = 'First Name',
    sortDir = 'asc',
    province = '',
    city = '',
    firm = '',
    branch = '', // Added branch parameter
    team = '',
  } = req.query;

  // Convert numeric strings
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 100;
  // The offset for pagination
  const offset = (pageNum - 1) * limitNum;

  // Database configuration
  const connectionConfig = {
    host: 'advisorwebapp.crcke66wq2ed.ca-central-1.rds.amazonaws.com',
    port: 3306,
    user: 'Admin',
    password: '28UKOJi3OshzZT',
    database: 'advisor_dashboard'
  };

  // Handle multi-select filters for province, city, firm, branch, team
  // Parse comma-separated values into arrays
  const provinces = province ? province.split(',') : [];
  const cities = city ? city.split(',') : [];
  const firms = firm ? firm.split(',') : [];
  const branches = branch ? branch.split(',') : []; // Added branches array
  const teams = team ? team.split(',') : [];

  try {
    const conn = await mysql.createConnection(connectionConfig);

    // Build WHERE clause for filtering
    const conditions = [];
    const params = [];

    // Add conditions for each filter if they have values
    if (provinces.length > 0) {
      const placeholders = provinces.map(() => '?').join(',');
      conditions.push(`TRIM(Province) IN (${placeholders})`);
      params.push(...provinces);
    }

    if (cities.length > 0) {
      const placeholders = cities.map(() => '?').join(',');
      conditions.push(`TRIM(City) IN (${placeholders})`);
      params.push(...cities);
    }

    if (firms.length > 0) {
      const placeholders = firms.map(() => '?').join(',');
      conditions.push(`TRIM(Firm) IN (${placeholders})`);
      params.push(...firms);
    }

    if (branches.length > 0) {
      const placeholders = branches.map(() => '?').join(',');
      conditions.push(`TRIM(Branch) IN (${placeholders})`);
      params.push(...branches);
    }

    if (teams.length > 0) {
      const placeholders = teams.map(() => '?').join(',');
      conditions.push(`TRIM(\`Team Name\`) IN (${placeholders})`);
      params.push(...teams);
    }

    // Combine all conditions with AND
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query for DISTINCT results
    const countQuery = `
      SELECT COUNT(DISTINCT \`Email\`, \`First Name\`, \`Last Name\`, \`Firm\`) AS count
      FROM \`data\`
      ${whereClause}
    `;

    // Main data query with DISTINCT, sorting and pagination
    // Basic sanitization for column names and sort direction
    const safeColumn = sortBy.replace(/[^a-zA-Z0-9_ ]/g, '');
    const safeDirection = sortDir.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    
    // Using DISTINCT to remove duplicates
    // Fix the ORDER BY clause to properly handle case-insensitive sorting
    const dataQuery = `
      SELECT DISTINCT *
      FROM \`data\`
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN \`${safeColumn}\` IS NULL OR TRIM(\`${safeColumn}\`) = '' 
          THEN 1
          ELSE 0 
        END,
        LOWER(TRIM(\`${safeColumn}\`)) ${safeDirection}
      LIMIT ? OFFSET ?
    `;

    // Execute count query
    const [countResult] = await conn.query(countQuery, params);
    const total = countResult[0].count || 0;

    // Execute data query with pagination parameters
    const dataParams = [...params, limitNum, offset];
    const [rows] = await conn.query(dataQuery, dataParams);

    await conn.end();

    // Additional server-side deduplication as a safety measure
    const uniqueRows = rows.reduce((acc, row) => {
      const key = `${row.Email}_${row['First Name']}_${row['Last Name']}_${row.Firm}`;
      if (!acc.map.has(key)) {
        acc.map.set(key, true);
        acc.result.push(row);
      }
      return acc;
    }, { map: new Map(), result: [] }).result;

    // Log the response for debugging
    console.log(`API /data response: ${uniqueRows.length} unique rows (from ${rows.length} total), total: ${total}`);

    // Return the deduplicated data with pagination info
    res.status(200).json({
      data: uniqueRows,
      total: total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    console.error("API /data error:", err);
    res.status(500).json({ error: err.message });
  }
}