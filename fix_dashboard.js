const fs = require('fs');
let c = fs.readFileSync('resources/js/Pages/Student/Dashboard.jsx', 'utf8');

c = c.replace(
    '<div\n                                    key={cert.id}\n                                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"\n                                >',
    '<Link\n                                    href={route(\\'marketplace.index\\')}\n                                    key={cert.id}\n                                    className="block bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer"\n                                >'
);

c = c.replace(
    'Preview\n                                            </span>\n                                        </div>\n                                    </div>\n                                </div>',
    'Preview\n                                            </span>\n                                        </div>\n                                    </div>\n                                </Link>'
);

fs.writeFileSync('resources/js/Pages/Student/Dashboard.jsx', c);
