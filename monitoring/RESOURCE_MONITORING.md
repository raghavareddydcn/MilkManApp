# MilkMan Monitoring - Enhanced Resource Dashboard

## Overview
Enhanced monitoring setup with container-level CPU, RAM, and system resources visualization using Prometheus, Grafana, cAdvisor, and Node Exporter.

## Components

### 1. **cAdvisor** (Container Advisor)
- **Port**: 8080
- **Purpose**: Provides container-level resource usage and performance metrics
- **URL**: http://localhost:8080
- **Metrics**: CPU, Memory, Network I/O, Disk I/O per container

### 2. **Node Exporter**
- **Port**: 9100
- **Purpose**: System-level metrics (CPU, RAM, Disk, Network)
- **Metrics**: Host machine resource utilization

### 3. **Prometheus**
- **Port**: 9090
- **Purpose**: Time-series database for metrics collection
- **URL**: http://localhost:9090

### 4. **Grafana**
- **Port**: 3000
- **Purpose**: Visualization and dashboards
- **URL**: http://localhost:3000
- **Credentials**: admin / admin

### 5. **PostgreSQL Exporter**
- **Port**: 9187
- **Purpose**: Database-specific metrics

## Enhanced Dashboard Features

### 📊 Available Dashboards

#### **MilkMan - System & Container Resources**
Location: `grafana/dashboards/milkman-dashboard-enhanced.json`

**Panels Included:**

1. **Container CPU Usage (%)** - Time series graph
   - Shows CPU usage percentage for each MilkMan container
   - 5-minute rate calculation
   - Real-time monitoring

2. **Container Memory Usage** - Time series graph
   - Memory consumption in bytes for each container
   - Tracks memory trends over time

3. **System CPU Usage** - Gauge
   - Overall system CPU utilization
   - Color-coded thresholds (Green < 60%, Yellow < 80%, Red ≥ 80%)

4. **System Memory Usage** - Gauge
   - Total system memory consumption
   - Shows percentage of available memory used

5. **System Disk Usage** - Gauge
   - Root filesystem usage percentage
   - Alerts when disk space is low

6. **Container Memory (Stacked)** - Bar chart
   - Stacked view of memory usage across all containers
   - Easy comparison of memory distribution

7. **Container Resources Summary** - Table
   - Comprehensive table with:
     - CPU percentage per container
     - Memory usage in bytes
     - Network In/Out rates
     - Color-coded CPU usage

8. **Container Network I/O** - Time series
   - Network receive and transmit rates
   - Bytes per second for each container

9. **Container Disk I/O** - Time series
   - Filesystem read and write rates
   - Tracks disk activity per container

### 🚀 Quick Start

#### Start Monitoring Stack
```powershell
cd e:\code_base\GitMilkMan\Monitoring
docker-compose up -d
```

#### Access Dashboards
1. **Grafana**: http://localhost:3000
   - Login: `admin` / `admin`
   - Navigate to Dashboards → MilkMan - System & Container Resources

2. **Prometheus**: http://localhost:9090
   - Query metrics directly
   - View targets status at: http://localhost:9090/targets

3. **cAdvisor**: http://localhost:8080
   - Direct container metrics UI
   - Per-container resource visualization

#### Stop Monitoring Stack
```powershell
cd e:\code_base\GitMilkMan\Monitoring
docker-compose down
```

## Key Metrics Explained

### Container Metrics (from cAdvisor)
```
container_cpu_usage_seconds_total          # Total CPU time consumed
container_memory_usage_bytes               # Current memory usage
container_network_receive_bytes_total      # Network bytes received
container_network_transmit_bytes_total     # Network bytes transmitted
container_fs_reads_bytes_total             # Filesystem read bytes
container_fs_writes_bytes_total            # Filesystem write bytes
```

### System Metrics (from Node Exporter)
```
node_cpu_seconds_total                     # CPU time per mode (idle, user, system)
node_memory_MemAvailable_bytes             # Available memory
node_memory_MemTotal_bytes                 # Total system memory
node_filesystem_avail_bytes                # Available disk space
node_filesystem_size_bytes                 # Total disk size
```

## Dashboard Queries

### Container CPU Usage
```promql
rate(container_cpu_usage_seconds_total{name=~"milkman.*"}[5m]) * 100
```

### Container Memory Usage
```promql
container_memory_usage_bytes{name=~"milkman.*"}
```

### System CPU Usage
```promql
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

### System Memory Usage
```promql
100 * (1 - ((node_memory_MemAvailable_bytes) / (node_memory_MemTotal_bytes)))
```

## Monitored Containers

The dashboard automatically tracks all containers with names matching `milkman.*`:
- `milkman-postgres` - PostgreSQL database
- `milkman-app` - Spring Boot backend
- `milkman-web` - React frontend

## Alerting Thresholds

### CPU
- 🟢 Green: < 60%
- 🟡 Yellow: 60-80%
- 🔴 Red: > 80%

### Memory
- 🟢 Green: < 60%
- 🟡 Yellow: 60-80%
- 🔴 Red: > 80%

### Disk
- 🟢 Green: < 70%
- 🟡 Yellow: 70-85%
- 🔴 Red: > 85%

## Troubleshooting

### cAdvisor not showing metrics
```powershell
# Check cAdvisor logs
docker logs milkman-cadvisor

# Verify cAdvisor is accessible
Invoke-WebRequest http://localhost:8080/metrics

# Check Prometheus targets
# Go to http://localhost:9090/targets
# Ensure 'cadvisor' target is 'UP'
```

### Dashboard not showing data
1. Verify all exporters are running:
   ```powershell
   docker ps --filter "name=milkman"
   ```

2. Check Prometheus scrape status:
   - Visit: http://localhost:9090/targets
   - All targets should show "UP" status

3. Verify container name pattern:
   - Container names must start with `milkman-`
   - Check: `docker ps --format "{{.Names}}"`

### Permission issues (Windows)
If cAdvisor fails to start on Windows:
- Run Docker Desktop as Administrator
- Ensure Hyper-V and WSL2 are properly configured

## Data Retention

- **Prometheus**: 15 days (default)
- **Grafana**: Persistent via Docker volumes
- **Scrape Interval**: 15 seconds
- **Dashboard Refresh**: 10 seconds (auto-refresh enabled)

## Advanced Configuration

### Adjust Scrape Interval
Edit `prometheus/prometheus.yml`:
```yaml
global:
  scrape_interval: 15s  # Change to desired interval
```

### Add Custom Metrics
1. Add new scrape config to `prometheus/prometheus.yml`
2. Restart Prometheus: `docker-compose restart prometheus`
3. Add panels to dashboard via Grafana UI

### Export Dashboard
1. Open Grafana → Dashboards
2. Click dashboard → Share → Export
3. Save JSON for backup/sharing

## Resources

- **Prometheus Docs**: https://prometheus.io/docs/
- **Grafana Docs**: https://grafana.com/docs/
- **cAdvisor**: https://github.com/google/cadvisor
- **Node Exporter**: https://github.com/prometheus/node_exporter

## Support

For issues or questions:
- Check Docker logs: `docker logs <container-name>`
- Verify network connectivity between containers
- Ensure all required ports are not in use by other services

---

**Last Updated**: 2025-12-25  
**Dashboard Version**: 1.0 Enhanced
