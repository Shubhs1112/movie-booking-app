﻿using System;
using System.Collections.Generic;

namespace Customer_Transaction_API.Models;

public partial class Efmigrationshistory
{
    public string MigrationId { get; set; } = null!;

    public string ProductVersion { get; set; } = null!;
}
