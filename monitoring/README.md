# MilkMan Monitoring Stack

Complete monitoring solution for the MilkMan application using Prometheus and Grafana.

## Components

- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization and dashboards
- **Node Exporter**: System-level metrics

## Quick Start

### Start Monitoring Stack
```bash
.\start-monitoring.bat
```

### Stop Monitoring Stack
```bash
.\stop-monitoring.bat
```

### View Logs
```bash
.\view-logs.bat
```

## Access URLs

### Grafana
- URL: http://localhost:3000
- Default Username: `admin`
- Default Password: `admin`
- You'll be prompted to change the password on first login

### Prometheus
- URL: http://localhost:9090
- Query interface and metric browser

### Node Exporter
- Metrics endpoint: http://localhost:9100/metrics

## Pre-configured Dashboard

The monitoring stack includes a comprehensive **MilkMan Application Dashboard** with:

1. **Application Status** - Real-time service health
2. **Request Rate** - HTTP requests per second by endpoint
3. **Response Time** - Average response times by endpoint
4. **JVM Memory Usage** - Heap and non-heap memory tracking
5. **CPU Usage** - Application CPU consumption
6. **Database Connection Pool** - Active, idle, and total connections
7. **JVM Threads** - Thread count monitoring
8. **HTTP Status Codes** - Distribution of response codes
9. **Garbage Collection** - GC pause frequency

Access the dashboard at: http://localhost:3000/d/milkman-app

## Spring Boot Configuration

To enable metrics collection, ensure your Spring Boot application has these dependencies:

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'io.micrometer:micrometer-registry-prometheus'
}
```

And these properties in `application.yml`:

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

## Architecture

```
┌─────────────────┐
│  Grafana UI     │
│  (port 3000)    │
└────────┬────────┘
         │
         │ Queries metrics
         │
┌────────▼────────────┐
│   Prometheus        │
│   (port 9090)       │
└────────┬────────────┘
         │
         │ Scrapes metrics every 15s
         │
    ┌────┴────┬─────────────┬──────────────┐
    │         │             │              │
┌───▼────┐ ┌─▼────────┐ ┌──▼─────────┐ ┌─▼─────────┐
│MilkMan │ │PostgreSQL│ │Node        │ │Prometheus │
│App     │ │          │ │Exporter    │ │Self       │
│:8081   │ │:9187     │ │:9100       │ │:9090      │
└────────┘ └──────────┘ └────────────┘ └───────────┘
```

## Monitoring Metrics

### Application Metrics (via Spring Boot Actuator)
- HTTP request rates and durations
- JVM memory (heap, non-heap, metaspace)
- Garbage collection statistics
- Thread pools and active threads
- Database connection pool (HikariCP)
- Custom business metrics

### System Metrics (via Node Exporter)
- CPU usage and load average
- Memory and swap usage
- Disk I/O and space
- Network traffic
- File system metrics

## Configuration Files

- `docker-compose.yml` - Service orchestration
- `prometheus/prometheus.yml` - Prometheus scrape configuration
- `grafana/provisioning/datasources/prometheus.yml` - Grafana datasource
- `grafana/provisioning/dashboards/dashboard.yml` - Dashboard provisioning
- `grafana/dashboards/milkman-dashboard.json` - Pre-built dashboard

## Customization

### Adding More Metrics to Prometheus

Edit `prometheus/prometheus.yml` and add new scrape targets:

```yaml
scrape_configs:
  - job_name: 'my-service'
    static_configs:
      - targets: ['my-service:port']
```

### Creating Custom Dashboards

1. Access Grafana at http://localhost:3000
2. Go to Dashboards → New Dashboard
3. Add panels with Prometheus queries
4. Save the dashboard
5. Export as JSON and save to `grafana/dashboards/`

## Troubleshooting

### Services not starting
```bash
# Check Docker logs
docker-compose logs prometheus
docker-compose logs grafana

# Verify network connectivity
docker network ls
docker network inspect milkman-monitoring
```

### Prometheus not scraping metrics
```bash
# Check Prometheus targets
# Open http://localhost:9090/targets
# All targets should show "UP" status
```

### Grafana can't connect to Prometheus
```bash
# Verify Prometheus is accessible
curl http://localhost:9090/-/healthy

# Check Grafana datasource configuration
# Grafana → Configuration → Data Sources → Prometheus
```

### No data in dashboards
1. Ensure MilkMan backend is running and exposing metrics
2. Check Prometheus is scraping: http://localhost:9090/targets
3. Verify time range in Grafana dashboard (try "Last 1 hour")
4. Check if actuator endpoints are enabled in Spring Boot

## Data Persistence

Monitoring data is persisted in Docker volumes:
- `prometheus_data` - Prometheus time-series database
- `grafana_data` - Grafana dashboards and settings

### Clean Restart (removes all data)
```bash
docker-compose down -v
docker-compose up -d
```

## Security Considerations

For production environments:
1. Change default Grafana admin password
2. Enable authentication on Prometheus
3. Use HTTPS for web interfaces
4. Restrict network access to monitoring ports
5. Set up alerting and notification channels

## Integration with Main Application

The monitoring stack connects to the MilkMan backend via Docker networking. Ensure:
1. MilkMan backend is running in the `gitmilkman_default` network
2. Actuator endpoints are exposed at `/milkman/actuator/prometheus`
3. Port 8081 is accessible within Docker network

## Next Steps

1. Configure alerting rules in Prometheus
2. Set up Grafana alert notifications (email, Slack, etc.)
3. Add more custom dashboards for business metrics
4. Implement log aggregation with ELK/Loki stack
5. Add distributed tracing with Jaeger/Zipkin
