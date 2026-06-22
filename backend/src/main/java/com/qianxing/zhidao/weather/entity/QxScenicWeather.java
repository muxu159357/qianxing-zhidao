package com.qianxing.zhidao.weather.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("qx_scenic_weather")
public class QxScenicWeather {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long locationId;
    private Long scenicSpotId;
    private LocalDate weatherDate;
    private BigDecimal temperatureHigh;
    private BigDecimal temperatureLow;
    private String weatherDesc;
    private String weatherIcon;
    private String windDirection;
    private String windLevel;
    private Integer humidity;
    private Integer visibility;
    private Integer uvIndex;
    private String tips;
    @JsonIgnore
    private String rawJson;
    private String provider;
    private LocalDateTime fetchedAt;
    private LocalDateTime createdAt;
}
